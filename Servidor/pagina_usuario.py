"""Consulta dados de perfil sem gravá-los em arquivos locais."""

from conexao import conectar


class Inicial:
    """Consulta os dados básicos de uma conta sem gravá-los em arquivos locais."""

    def __init__(self, email):
        self.email = email

    def dados(self):
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT email, id_usuario, nome FROM usuario WHERE email = %s",
                    (self.email,),
                )
                linha = cursor_sql.fetchone()
        if linha is None:
            return None
        return {"email": linha[0], "id_usuario": linha[1], "nome": linha[2]}
