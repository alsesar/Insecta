import sqlite3

class Cadastro:
    def __init__(self, nome, email, id_usuario, senha):
        # Armazena os dados recebidos diretamente
        self.nome = nome
        self.email = email
        self.id_usuario = id_usuario
        self.senha = senha

    def usuario(self, g):
        conn = sqlite3.connect(r'C:\Insecta\Back-End\Data-Base\DTBS_teste.db')
        conn.execute("PRAGMA foreign_keys = ON")
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Usuario (email, nome, id_usuario, senha) VALUES (?, ?, ?, ?)",
            (f'{self.email}', self.nome, f'{self.id_usuario}{g}', self.senha)
        )

        conn.commit()
        conn.close()