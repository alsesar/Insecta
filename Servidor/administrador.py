"""Regras de criação, consulta e remoção de permissões administrativas."""

from datetime import datetime
from conexao import conectar


class Administrador:
    """Gerencia a tabela `adm` (email, nivel_acesso, criado_em)."""

    NIVEL_MIN = 1
    NIVEL_MAX = 10

    def __init__(self, email: str, nivel_acesso: int = 1):
        self.email = email
        self.nivel_acesso = nivel_acesso

    def promover(self) -> bool:
        """Cria ou atualiza o registro de admin. False se usuário não existir."""
        if not (self.NIVEL_MIN <= self.nivel_acesso <= self.NIVEL_MAX):
            raise ValueError(
                f"nivel_acesso deve estar entre {self.NIVEL_MIN} e {self.NIVEL_MAX}"
            )

        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute("SELECT 1 FROM usuario WHERE email = %s", (self.email,))
                if cursor_sql.fetchone() is None:
                    return False

                cursor_sql.execute(
                    "INSERT INTO adm (email, nivel_acesso) VALUES (%s, %s) "
                    "ON CONFLICT (email) DO UPDATE SET nivel_acesso = EXCLUDED.nivel_acesso",
                    (self.email, self.nivel_acesso),
                )
            conexao_bd.commit()
        return True

    @staticmethod
    def rebaixar(email: str) -> bool:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute("DELETE FROM adm WHERE email = %s", (email,))
                removeu = cursor_sql.rowcount > 0
            conexao_bd.commit()
        return removeu

    @staticmethod
    def eh_admin(email: str) -> bool:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute("SELECT 1 FROM adm WHERE email = %s", (email,))
                return cursor_sql.fetchone() is not None

    @staticmethod
    def nivel_de(email: str) -> int | None:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute("SELECT nivel_acesso FROM adm WHERE email = %s", (email,))
                linha = cursor_sql.fetchone()
        return linha[0] if linha else None

    @staticmethod
    def listar_todos() -> list[dict]:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT a.email, u.nome, a.nivel_acesso, a.criado_em "
                    "FROM adm a JOIN usuario u ON u.email = a.email "
                    "ORDER BY a.nivel_acesso DESC, a.email"
                )
                return [
                    {
                        "email": r[0],
                        "nome": r[1],
                        "nivel_acesso": r[2],
                        "criado_em": r[3].isoformat() if isinstance(r[3], datetime) else r[3],
                    }
                    for r in cursor_sql.fetchall()
                ]