"""Consulta estatísticas e usuários para a área administrativa."""

from datetime import datetime
from conexao import conectar


class PaginaAdministracao:
    """Dados agregados para o painel administrativo, somente para leitura."""

    def __init__(self, email_admin: str):
        self.email_admin = email_admin

    # ---------- Estatísticas ---------------------------------------

    def estatisticas(self) -> dict:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute("SELECT COUNT(*) FROM usuario")
                total_usuarios = cursor_sql.fetchone()[0]

                cursor_sql.execute(
                    "SELECT COUNT(*) FROM usuario WHERE datacriacao >= NOW() - INTERVAL '7 days'"
                )
                novos_7d = cursor_sql.fetchone()[0]

                cursor_sql.execute("SELECT COUNT(*) FROM adm")
                total_admins = cursor_sql.fetchone()[0]

                cursor_sql.execute("SELECT COUNT(*) FROM conteudo")
                total_conteudos = cursor_sql.fetchone()[0]

                cursor_sql.execute("SELECT COUNT(*) FROM assinatura WHERE ativa = TRUE")
                assinaturas_ativas = cursor_sql.fetchone()[0]

        return {
            "total_usuarios": total_usuarios,
            "novos_ultimos_7_dias": novos_7d,
            "total_admins": total_admins,
            "total_conteudos": total_conteudos,
            "assinaturas_ativas": assinaturas_ativas,
        }

    # ---------- Listagem de usuários -------------------------------

    def listar_usuarios(self, limite: int = 100, offset: int = 0) -> list[dict]:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT email, id_usuario, nome, datacriacao "
                    "FROM usuario ORDER BY datacriacao DESC LIMIT %s OFFSET %s",
                    (limite, offset),
                )
                return [
                    {
                        "email": r[0],
                        "id_usuario": r[1],
                        "nome": r[2],
                        "datacriacao": r[3].isoformat() if isinstance(r[3], datetime) else r[3],
                    }
                    for r in cursor_sql.fetchall()
                ]

    def detalhes_usuario(self, email: str) -> dict | None:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT email, id_usuario, nome, datacriacao, token "
                    "FROM usuario WHERE email = %s",
                    (email,),
                )
                linha = cursor_sql.fetchone()
                if linha is None:
                    return None

                cursor_sql.execute("SELECT nivel_acesso FROM adm WHERE email = %s", (email,))
                adm_row = cursor_sql.fetchone()

                cursor_sql.execute(
                    "SELECT permissao FROM permissoes WHERE email = %s ORDER BY permissao",
                    (email,),
                )
                permissoes = [r[0] for r in cursor_sql.fetchall()]

                cursor_sql.execute(
                    "SELECT id, plano, inicio, fim, ativa FROM assinatura "
                    "WHERE email = %s ORDER BY inicio DESC LIMIT 1",
                    (email,),
                )
                assinatura_row = cursor_sql.fetchone()

        assinatura = None
        if assinatura_row:
            assinatura = {
                "id": assinatura_row[0],
                "plano": assinatura_row[1],
                "inicio": assinatura_row[2].isoformat()
                          if isinstance(assinatura_row[2], datetime) else assinatura_row[2],
                "fim": assinatura_row[3].isoformat()
                       if isinstance(assinatura_row[3], datetime) else assinatura_row[3],
                "ativa": assinatura_row[4],
            }

        return {
            "email": linha[0],
            "id_usuario": linha[1],
            "nome": linha[2],
            "datacriacao": linha[3].isoformat() if isinstance(linha[3], datetime) else linha[3],
            "token": linha[4],
            "nivel_acesso": adm_row[0] if adm_row else None,
            "permissoes": permissoes,
            "assinatura": assinatura,
        }

    # ---------- Relacionamentos ------------------------------------

    def listar_relacionamentos(self, email: str) -> list[dict]:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT u.email, u.nome, u.id_usuario "
                    "FROM relacionamento r JOIN usuario u ON u.id_usuario = r.amigo "
                    "WHERE r.usuario = (SELECT id_usuario FROM usuario WHERE email = %s)",
                    (email,),
                )
                return [
                    {"email": r[0], "nome": r[1], "id_usuario": r[2]}
                    for r in cursor_sql.fetchall()
                ]

    # ---------- Últimos cadastros ----------------------------------

    def ultimos_cadastros(self, quantidade: int = 10) -> list[dict]:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT nome, email, datacriacao FROM usuario "
                    "ORDER BY datacriacao DESC LIMIT %s",
                    (quantidade,),
                )
                return [
                    {
                        "nome": r[0],
                        "email": r[1],
                        "datacriacao": r[2].isoformat() if isinstance(r[2], datetime) else r[2],
                    }
                    for r in cursor_sql.fetchall()
                ]