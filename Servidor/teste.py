"""Verifica manualmente se a configuração consegue acessar o PostgreSQL."""

import psycopg
import conexao


try:
    with conexao.conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute(
                "INSERT INTO usuario (nome, email, id_usuario, senha) "
                "VALUES (%s, %s, %s, %s) "
                "ON CONFLICT (email) DO NOTHING "
                "RETURNING email, nome, id_usuario",
                ("Alice", "alice@example.com", "alice123", "Password123!"),
            )
            inserido = cursor_sql.fetchone()
            print("Usuário inserido:", inserido)
        conexao_bd.commit()
    print("Conexão com o banco esperado funcionando.")
except (psycopg.Error, RuntimeError) as erro:
    print("Falha na conexão:", erro)