"""Cria, valida e encerra sessões autenticadas usadas pela API."""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from functools import wraps

from flask import g, jsonify, request

from conexao import conectar


VALIDADE_DIAS = 30


def _hash_token(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def criar_sessao(email):
    token = secrets.token_urlsafe(32)
    expira_em = datetime.now(timezone.utc) + timedelta(days=VALIDADE_DIAS)
    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute("DELETE FROM sessao WHERE expira_em <= NOW()")
            cursor_sql.execute(
                "INSERT INTO sessao (token_hash, email, expira_em) VALUES (%s, %s, %s)",
                (_hash_token(token), email, expira_em),
            )
        conexao_bd.commit()
    return token, expira_em


def exigir_login(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        authorization = request.headers.get("Authorization", "")
        esquema, separador, token = authorization.partition(" ")
        if esquema.lower() != "bearer" or not separador or not token.strip():
            return jsonify({"error": "Autenticação necessária"}), 401

        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT email FROM sessao "
                    "WHERE token_hash = %s AND expira_em > NOW()",
                    (_hash_token(token.strip()),),
                )
                linha = cursor_sql.fetchone()
        if linha is None:
            return jsonify({"error": "Sessão inválida ou expirada"}), 401

        g.email = linha[0]
        return func(*args, **kwargs)

    return wrapper


def encerrar_sessao(token):
    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute("DELETE FROM sessao WHERE token_hash = %s", (_hash_token(token),))
        conexao_bd.commit()
