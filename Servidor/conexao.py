"""Centraliza a configuração e a abertura de conexões PostgreSQL."""

import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv


load_dotenv(Path(__file__).resolve().with_name(".env"))

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_NAME = os.getenv("DB_NAME", "DB")
DB_USER = os.getenv("DB_USER", "Felip3__u")
DB_PASSWORD = os.getenv("DB_PASSWORD")


class ErroConfiguracaoBanco(RuntimeError):
    pass


def conectar():
    """Abre conexão com a base configurada por variáveis de ambiente."""
    if not DB_PASSWORD:
        raise ErroConfiguracaoBanco(
            "Configure DB_PASSWORD no ambiente do backend."
        )

    conexao_bd = psycopg.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
    )
    try:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute(
                "SELECT current_database(), current_user, inet_server_port()"
            )
            banco, usuario, porta = cursor_sql.fetchone()
        if banco != DB_NAME or usuario != DB_USER or porta != DB_PORT:
            raise ErroConfiguracaoBanco(
                f"Conexão inesperada: banco={banco!r}, usuário={usuario!r}, "
                f"porta={porta!r}."
            )
    except Exception:
        conexao_bd.close()
        raise
    return conexao_bd
