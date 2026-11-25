"""Cria e valida códigos temporários enviados por email."""

import secrets
import string
import os
import smtplib
from datetime import datetime
from email.message import EmailMessage
from conexao import conectar


class Codigo:
    TOKEN_TTL_SEGUNDOS = 300  # 5 minutos

    def __init__(self, tamanho=6):
        self.tamanho = tamanho

    def _gerar_string_token(self):
        caracteres = string.ascii_letters + string.digits + "!@#$%&*"
        codigo = ''.join(secrets.choice(caracteres) for _ in range(self.tamanho))
        return f"{codigo}, {datetime.now().isoformat()}"

    def gerar_codigo(self):
        return self._gerar_string_token()

    def gerar_codigo_salvo(self, email):
        cod = self._gerar_string_token()
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "UPDATE usuario SET token = %s WHERE email = %s",
                    (cod, email),
                )
            conexao_bd.commit()
        return cod

    def token_email(self, email):
        codigo_completo = self.gerar_codigo_salvo(email)
        codigo = codigo_completo.split(", ")[0]

        email_user = os.getenv('EMAIL_USER')
        email_pass = os.getenv('EMAIL_PASS')

        # Se as credenciais não estão configuradas, apenas devolve o código
        # (útil em ambiente de testes sem SMTP configurado)
        if not email_user or not email_pass:
            return codigo

        msg = EmailMessage()
        msg['Subject'] = 'Seu token de verificação'
        msg['From'] = email_user
        msg['To'] = email
        msg.set_content(f'Seu código é: {codigo}')

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(email_user, email_pass)
            smtp.send_message(msg)

        return codigo

    def enviar_codigo(self, email, novo_codigo=False):
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute("SELECT token FROM usuario WHERE email = %s", (email,))
                linha = cursor_sql.fetchone()
                if linha is None:
                    return "Esse email de usuario não é válido."

                token_bruto = linha[0]

                # Se já existe token e não pediu novo, tenta reutilizar se válido
                if not novo_codigo and token_bruto:
                    partes = token_bruto.split(", ", 1)
                    if len(partes) == 2:
                        codigo_token, data_str = partes
                        try:
                            data_token = datetime.fromisoformat(data_str)
                            if (datetime.now() - data_token).total_seconds() < self.TOKEN_TTL_SEGUNDOS:
                                return codigo_token
                        except ValueError:
                            pass  # data inválida → gera novo

                # Gera novo token
                novo = self._gerar_string_token()
                cursor_sql.execute("UPDATE usuario SET token = %s WHERE email = %s", (novo, email))
            conexao_bd.commit()

        return novo.split(", ")[0]