"""Cria contas e armazena as senhas em formato de hash."""

from conexao import conectar
from criptografia import Criptografia

class Cadastro:
    def __init__(self, nome, email, id_usuario, senha):
        self.nome = nome
        self.email = email
        self.id_usuario = id_usuario
        self.senha = senha

    def usuario(self):
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "INSERT INTO usuario (email, nome, id_usuario, senha) "
                    "VALUES (%s, %s, %s, %s)",
                    (self.email, self.nome, self.id_usuario,
                    Criptografia.hash_senha(self.senha)),
                )
            conexao_bd.commit()
        return True