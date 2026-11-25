"""Valida as credenciais de uma conta cadastrada no PostgreSQL."""

from conexao import conectar
from criptografia import Criptografia

class Autenticacao:
    def __init__(self, email, senha):
        self.email = email
        self.senha = senha

    def usuario(self):
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                from criptografia import Criptografia
                cursor_sql.execute(
                "SELECT senha FROM usuario WHERE email = %s", (self.email,)
                )
                linha = cursor_sql.fetchone()
                if linha is None:
                    return False
                return Criptografia.verificar_senha(self.senha, linha[0])