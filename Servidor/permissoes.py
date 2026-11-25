"""Gerencia as permissões adicionais associadas às contas."""

import uuid
from conexao import conectar


class Permissoes:
    """Gerencia a tabela `permissoes` (email, permissao)."""

    # Lista canônica — estenda conforme o TCC evoluir
    PERMISSOES_VALIDAS = (
        "admin_total",
        "gerenciar_usuarios",
        "gerenciar_conteudo",
        "moderar_relacionamentos",
        "visualizar_relatorios",
    )

    @staticmethod
    def _validar(permissao: str) -> bool:
        return permissao in Permissoes.PERMISSOES_VALIDAS

    @staticmethod
    def conceder(email: str, permissao: str) -> bool:
        """Concede permissão. Retorna False se o usuário não existir."""
        if not Permissoes._validar(permissao):
            raise ValueError(f"Permissão inválida: {permissao!r}")

        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute("SELECT 1 FROM usuario WHERE email = %s", (email,))
                if cursor_sql.fetchone() is None:
                    return False

                cursor_sql.execute(
                    "INSERT INTO permissoes (id, email, permissao) VALUES (%s, %s, %s) "
                    "ON CONFLICT (email, permissao) DO NOTHING",
                    (str(uuid.uuid4()), email, permissao),
                )
            conexao_bd.commit()
        return True

    @staticmethod
    def revogar(email: str, permissao: str) -> bool:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "DELETE FROM permissoes WHERE email = %s AND permissao = %s",
                    (email, permissao),
                )
                removeu = cursor_sql.rowcount > 0
            conexao_bd.commit()
        return removeu

    @staticmethod
    def listar_por_email(email: str) -> list[str]:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT permissao FROM permissoes WHERE email = %s ORDER BY permissao",
                    (email,),
                )
                return [linha[0] for linha in cursor_sql.fetchall()]

    @staticmethod
    def tem_permissao(email: str, permissao: str) -> bool:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT 1 FROM permissoes WHERE email = %s AND permissao = %s",
                    (email, permissao),
                )
                return cursor_sql.fetchone() is not None

    @staticmethod
    def listar_todos() -> list[dict]:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT id, email, permissao FROM permissoes ORDER BY email, permissao"
                )
                return [
                    {"id": r[0], "email": r[1], "permissao": r[2]}
                    for r in cursor_sql.fetchall()
                ]