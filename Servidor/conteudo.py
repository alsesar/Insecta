"""Executa operações de cadastro, consulta e atualização do conteúdo didático."""

from conexao import conectar


class Conteudo:
    """Gerencia a tabela `conteudo` (titulo, conteudo, nivel, gabarito)."""

    def __init__(self, titulo: str = None, conteudo: str = None,
                 nivel: str = None, gabarito: str = None):
        self.titulo = titulo
        self.conteudo = conteudo
        self.nivel = nivel
        self.gabarito = gabarito

    # ---------- CRIAR ----------------------------------------------

    def criar(self) -> bool:
        if not all([self.titulo, self.conteudo, self.nivel]):
            raise ValueError("titulo, conteudo e nivel são obrigatórios")

        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "INSERT INTO conteudo (titulo, conteudo, nivel, gabarito) "
                    "VALUES (%s, %s, %s, %s) "
                    "ON CONFLICT (titulo) DO NOTHING",
                    (self.titulo, self.conteudo, self.nivel, self.gabarito),
                )
                inseriu = cursor_sql.rowcount > 0
            conexao_bd.commit()
        return inseriu

    # ---------- CONSULTAR ------------------------------------------

    @staticmethod
    def _row_to_dict(linha) -> dict:
        return {
            "titulo": linha[0],
            "conteudo": linha[1],
            "nivel": linha[2],
            "gabarito": linha[3],
        }

    @staticmethod
    def buscar_por_titulo(titulo: str) -> dict | None:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT titulo, conteudo, nivel, gabarito FROM conteudo WHERE titulo = %s",
                    (titulo,),
                )
                linha = cursor_sql.fetchone()
        return Conteudo._row_to_dict(linha) if linha else None

    @staticmethod
    def buscar_por_nivel(nivel: str) -> dict | None:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT titulo, conteudo, nivel, gabarito FROM conteudo WHERE nivel = %s",
                    (nivel,),
                )
                linha = cursor_sql.fetchone()
        return Conteudo._row_to_dict(linha) if linha else None

    @staticmethod
    def listar_todos() -> list[dict]:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "SELECT titulo, nivel FROM conteudo ORDER BY nivel"
                )
                return [
                    {"titulo": r[0], "nivel": r[1]} for r in cursor_sql.fetchall()
                ]

    # ---------- ATUALIZAR ------------------------------------------

    def atualizar(self) -> bool:
        if not self.titulo:
            raise ValueError("titulo é obrigatório para atualizar")

        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "UPDATE conteudo SET conteudo = COALESCE(%s, conteudo), "
                    "nivel = COALESCE(%s, nivel), gabarito = COALESCE(%s, gabarito) "
                    "WHERE titulo = %s",
                    (self.conteudo, self.nivel, self.gabarito, self.titulo),
                )
                atualizou = cursor_sql.rowcount > 0
            conexao_bd.commit()
        return atualizou

    # ---------- REMOVER --------------------------------------------

    @staticmethod
    def deletar(titulo: str) -> bool:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute("DELETE FROM conteudo WHERE titulo = %s", (titulo,))
                removeu = cursor_sql.rowcount > 0
            conexao_bd.commit()
        return removeu