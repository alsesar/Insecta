from flask import Flask, request, jsonify
import uuid
from cadastro import Cadastro
import sqlite3

app = Flask(__name__)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')
    id_usuario = data.get('id_usuario')

    if not all([nome, email, senha]):
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400

    if not id_usuario:
        id_usuario = nome

    # Gera o sufixo único (parâmetro g)
    g = str(uuid.uuid4())[:8]

    # Instancia Cadastro com os dados recebidos e executa a inserção
    cad = Cadastro(nome, email, id_usuario, senha)
    cad.usuario(g)

    return jsonify({'message': 'Cadastro realizado com sucesso!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    senha = data.get('senha')

    if not email or not senha:
        return jsonify({'error': 'Preencha email e senha'}), 400

    conn = sqlite3.connect('Data-Base/DTBS_teste.db')
    conn.execute("PRAGMA foreign_keys = ON")
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM Usuario WHERE email = ? AND senha = ?', (email, senha))
    usuario = cursor.fetchone()
    conn.close()

    if usuario is None:
        return jsonify({'error': 'Email ou senha incorretos'}), 401

    return jsonify({'message': 'Login realizado com suscesso!'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

