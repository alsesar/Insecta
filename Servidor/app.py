"""Define as rotas HTTP e coordena as operações da API do Insecta."""

import hashlib
import hmac
import os
import re
import secrets
import smtplib
import unicodedata
import uuid
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from flask import Flask, g, jsonify, request, send_file
import psycopg
from psycopg.errors import UniqueViolation

from administrador import Administrador
from cadastro import Cadastro
from conexao import ErroConfiguracaoBanco, conectar
from conteudo import Conteudo
from criptografia import Criptografia
from pagina_administracao import PaginaAdministracao
from sessao import criar_sessao, encerrar_sessao, exigir_login
from verificacao import Verificacoes


app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024 + 64 * 1024
_tentativas = {}


def _json_objeto():
    dados = request.get_json(silent=True)
    return dados if isinstance(dados, dict) else {}


def _email_normalizado(email):
    return email.strip().lower() if isinstance(email, str) else ""


def _usuario(email):
    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute(
                "SELECT u.email, u.id_usuario, u.nome, u.apelido, u.nivel, u.foto_id "
                "FROM usuario u WHERE u.email = %s",
                (email,),
            )
            linha = cursor_sql.fetchone()
            if linha is None:
                return None
            cursor_sql.execute(
                "SELECT atividade, percentual FROM progresso_atividade "
                "WHERE email = %s ORDER BY atividade",
                (email,),
            )
            progresso = {str(r[0]): r[1] for r in cursor_sql.fetchall()}
    return {
        "id_usuario": linha[1],
        "email": linha[0],
        "nome": linha[2],
        "apelido": linha[3],
        "nivel": linha[4],
        "foto_url": f"/fotos/{linha[5]}" if linha[5] else None,
        "progresso": progresso,
    }


def _limitar_tentativas(chave, limite=5, janela=900):
    agora = datetime.now(timezone.utc).timestamp()
    tentativas = [t for t in _tentativas.get(chave, []) if agora - t < janela]
    if len(tentativas) >= limite:
        _tentativas[chave] = tentativas
        return False
    tentativas.append(agora)
    _tentativas[chave] = tentativas
    return True


def _limpar_tentativas(chave):
    _tentativas.pop(chave, None)


def _token_email(email, codigo):
    email_user = os.getenv("EMAIL_USER")
    email_pass = os.getenv("EMAIL_PASS")
    if not email_user or not email_pass:
        app.logger.info("Código de recuperação para %s: %s", email, codigo)
        return
    msg = EmailMessage()
    msg["Subject"] = "Seu código de recuperação do Insecta"
    msg["From"] = email_user
    msg["To"] = email
    msg.set_content(f"Seu código de recuperação é: {codigo}\nEle expira em 5 minutos.")
    with smtplib.SMTP_SSL(os.getenv("SMTP_HOST", "smtp.gmail.com"), 465) as smtp:
        smtp.login(email_user, email_pass)
        smtp.send_message(msg)


@app.after_request
def adicionar_cors(resposta_http):
    origens_permitidas = {
        origem.strip()
        for origem in os.getenv("CORS_ORIGIN", "*").split(",")
        if origem.strip()
    }
    origens_locais = {
        "http://localhost:8081",
        "http://127.0.0.1:8081",
    }
    if origens_permitidas & origens_locais:
        origens_permitidas.update(origens_locais)
    origem_requisicao = request.headers.get("Origin")
    if "*" in origens_permitidas:
        resposta_http.headers["Access-Control-Allow-Origin"] = "*"
    elif origem_requisicao in origens_permitidas:
        resposta_http.headers["Access-Control-Allow-Origin"] = origem_requisicao
        resposta_http.headers["Vary"] = "Origin"
    resposta_http.headers["Access-Control-Allow-Headers"] = (
        "Content-Type, Authorization"
    )
    resposta_http.headers["Access-Control-Allow-Methods"] = (
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    )
    return resposta_http


@app.errorhandler(413)
def arquivo_grande(_erro):
    return jsonify({"error": "A imagem deve ter no máximo 5 MB"}), 413


@app.errorhandler(404)
def rota_nao_encontrada(_erro):
    return jsonify({"error": "Rota não encontrada"}), 404


@app.errorhandler(405)
def metodo_nao_permitido(_erro):
    return jsonify({"error": "Método não permitido"}), 405


@app.errorhandler(UniqueViolation)
def conflito_unico(_erro):
    return jsonify({"error": "Esse dado já está cadastrado"}), 409


@app.errorhandler(psycopg.Error)
def erro_banco(erro):
    app.logger.error("Falha ao consultar o PostgreSQL: %s", erro)
    return jsonify({"error": "Falha ao acessar o banco de dados"}), 503


@app.errorhandler(ErroConfiguracaoBanco)
def erro_configuracao_banco(erro):
    app.logger.error("Configuração PostgreSQL inválida: %s", erro)
    return jsonify({"error": "Banco de dados não configurado"}), 503


@app.route("/signup", methods=["POST"])
def cadastrar_usuario():
    dados = _json_objeto()
    nome = dados.get("nome")
    email = _email_normalizado(dados.get("email"))
    senha = dados.get("senha")
    if not isinstance(nome, str) or not nome.strip() or not email or not isinstance(senha, str):
        return jsonify({"error": "Preencha nome, email e senha"}), 400
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        return jsonify({"error": "Informe um email válido"}), 400
    if not Verificacoes.verificar_senha_forte(senha):
        return jsonify({"error": "A senha deve ter ao menos 8 caracteres, maiúscula, minúscula, número e símbolo"}), 400

    try:
        resultado = Cadastro(
            nome.strip(), email, uuid.uuid4().hex, senha
        ).usuario()
    except UniqueViolation:
        return jsonify({"error": "Esse email já está cadastrado. Tente entrar."}), 409
    if resultado is not True:
        return jsonify({"error": str(resultado)}), 400
    return jsonify({"message": "Cadastro realizado com sucesso!"}), 201


@app.route("/login", methods=["POST"])
def autenticar_usuario():
    dados = _json_objeto()
    email = _email_normalizado(dados.get("email"))
    senha = dados.get("senha")
    chave = f"{request.remote_addr}:{email}"
    if not _limitar_tentativas(chave):
        return jsonify({"error": "Muitas tentativas. Aguarde 15 minutos."}), 429
    if not email or not isinstance(senha, str):
        return jsonify({"error": "Email ou senha incorretos"}), 401

    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute("SELECT senha FROM usuario WHERE email = %s", (email,))
            linha = cursor_sql.fetchone()
            if linha is None or not Criptografia.verificar_senha(senha, linha[0]):
                return jsonify({"error": "Email ou senha incorretos"}), 401
            if Criptografia.precisa_rehash(linha[0]):
                cursor_sql.execute(
                    "UPDATE usuario SET senha = %s WHERE email = %s",
                    (Criptografia.hash_senha(senha), email),
                )
        conexao_bd.commit()
    _limpar_tentativas(chave)
    token, expira_em = criar_sessao(email)
    return jsonify({
        "token": token,
        "expira_em": expira_em.isoformat(),
        "usuario": _usuario(email),
    }), 200


@app.route("/logout", methods=["POST"])
@exigir_login
def sair():
    authorization = request.headers.get("Authorization", "")
    token = authorization.partition(" ")[2].strip()
    encerrar_sessao(token)
    return "", 204


@app.route("/me", methods=["GET"])
@exigir_login
def obter_me():
    dados = _usuario(g.email)
    if dados is None:
        return jsonify({"error": "Usuário não encontrado"}), 404
    progresso = dados.pop("progresso")
    return jsonify({"usuario": dados, "progresso": progresso})


@app.route("/me", methods=["PATCH"])
@exigir_login
def atualizar_me():
    dados = _json_objeto()
    campos = []
    valores = []
    if "apelido" in dados:
        apelido = dados["apelido"]
        if not isinstance(apelido, str):
            return jsonify({"error": "Apelido inválido"}), 400
        apelido = unicodedata.normalize("NFKC", apelido).strip()
        if not apelido or len(apelido) > 40 or any(ord(c) < 32 or ord(c) == 127 for c in apelido):
            return jsonify({"error": "Informe um apelido de 1 a 40 caracteres, sem controles"}), 400
        campos.append("apelido = %s")
        valores.append(apelido)
    if "nivel" in dados:
        nivel = dados["nivel"]
        if not isinstance(nivel, str) or nivel not in {
            "iniciante",
            "intermediario",
            "avancado",
        }:
            return jsonify({"error": "Nível inválido"}), 400
        campos.append("nivel = %s")
        valores.append(nivel)
    if not campos:
        return jsonify({"error": "Informe apelido ou nível para atualizar"}), 400
    valores.append(g.email)
    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute(
                f"UPDATE usuario SET {', '.join(campos)} WHERE email = %s",
                valores,
            )
        conexao_bd.commit()
    usuario = _usuario(g.email)
    usuario.pop("progresso")
    return jsonify({"usuario": usuario})


@app.route("/me/foto", methods=["PUT"])
@exigir_login
def atualizar_foto():
    arquivo = request.files.get("foto")
    if arquivo is None:
        return jsonify({"error": "Envie uma imagem no campo foto"}), 400
    dados = arquivo.read(5 * 1024 * 1024 + 1)
    if not dados or len(dados) > 5 * 1024 * 1024:
        return jsonify({"error": "A imagem deve ter entre 1 byte e 5 MB"}), 413
    assinaturas = (
        (b"\xff\xd8\xff", "image/jpeg"),
        (b"\x89PNG\r\n\x1a\n", "image/png"),
        (b"RIFF", "image/webp"),
    )
    mime = next(
        (
            tipo for assinatura, tipo in assinaturas
            if dados.startswith(assinatura)
            and (tipo != "image/webp" or dados[8:12] == b"WEBP")
        ),
        None,
    )
    if mime is None:
        return jsonify({"error": "Formato inválido; use JPG, PNG ou WebP"}), 415
    foto_id = uuid.uuid4()
    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute(
                "INSERT INTO foto_perfil (foto_id, email, mime, dados) "
                "VALUES (%s, %s, %s, %s) "
                "ON CONFLICT (email) DO UPDATE SET foto_id = EXCLUDED.foto_id, "
                "mime = EXCLUDED.mime, dados = EXCLUDED.dados, criado_em = NOW()",
                (foto_id, g.email, mime, dados),
            )
            cursor_sql.execute(
                "UPDATE usuario SET foto_id = %s WHERE email = %s",
                (foto_id, g.email),
            )
        conexao_bd.commit()
    return jsonify({"foto_url": f"/fotos/{foto_id}"})


@app.route("/fotos/<uuid:foto_id>", methods=["GET"])
def obter_foto(foto_id):
    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute(
                "SELECT mime, dados FROM foto_perfil WHERE foto_id = %s",
                (foto_id,),
            )
            linha = cursor_sql.fetchone()
    if linha is None:
        return jsonify({"error": "Foto não encontrada"}), 404
    from io import BytesIO
    resposta_http = send_file(BytesIO(bytes(linha[1])), mimetype=linha[0])
    resposta_http.headers["X-Content-Type-Options"] = "nosniff"
    resposta_http.headers["Cross-Origin-Resource-Policy"] = "cross-origin"
    return resposta_http


def _progresso(email):
    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute(
                "SELECT atividade, percentual FROM progresso_atividade "
                "WHERE email = %s ORDER BY atividade",
                (email,),
            )
            return {str(linha[0]): linha[1] for linha in cursor_sql.fetchall()}


@app.route("/progresso", methods=["GET"])
@exigir_login
def obter_progresso():
    return jsonify(_progresso(g.email))


@app.route("/progresso/<int:atividade>", methods=["PUT"])
@exigir_login
def salvar_progresso(atividade):
    percentual = _json_objeto().get("percentual")
    if not 1 <= atividade <= 7 or isinstance(percentual, bool) or not isinstance(percentual, int) or not 0 <= percentual <= 100:
        return jsonify({"error": "Atividade ou percentual inválido"}), 400
    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            if atividade > 1:
                cursor_sql.execute(
                    "SELECT percentual FROM progresso_atividade "
                    "WHERE email = %s AND atividade = %s",
                    (g.email, atividade - 1),
                )
                anterior = cursor_sql.fetchone()
                if anterior is None or anterior[0] != 100:
                    return jsonify({"error": "Conclua a atividade anterior primeiro"}), 409
            cursor_sql.execute(
                "INSERT INTO progresso_atividade (email, atividade, percentual) "
                "VALUES (%s, %s, %s) ON CONFLICT (email, atividade) DO UPDATE "
                "SET percentual = GREATEST(progresso_atividade.percentual, EXCLUDED.percentual), "
                "atualizado_em = NOW()",
                (g.email, atividade, percentual),
            )
        conexao_bd.commit()
    return jsonify({"progresso": _progresso(g.email)})


@app.route("/social/ranking", methods=["GET"])
@exigir_login
def ranking_social():
    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute(
                "SELECT u.id_usuario, u.apelido, "
                "COUNT(p.atividade) FILTER (WHERE p.percentual = 100) AS concluidas, "
                "(u.email = %s) AS atual "
                "FROM usuario u "
                "LEFT JOIN progresso_atividade p ON p.email = u.email "
                "WHERE u.email = %s OR u.id_usuario IN ("
                "SELECT amigo FROM relacionamento WHERE usuario = "
                "(SELECT id_usuario FROM usuario WHERE email = %s)) "
                "GROUP BY u.id_usuario, u.apelido, u.email "
                "ORDER BY concluidas DESC, atual DESC",
                (g.email, g.email, g.email),
            )
            rows = cursor_sql.fetchall()
    return jsonify([
        {
            "id_usuario": linha[0],
            "apelido": linha[1] or "Sem apelido",
            "atividadesConcluidas": linha[2],
            "usuarioAtual": linha[3],
        }
        for linha in rows
    ])


@app.route("/social/amigos", methods=["POST"])
@exigir_login
def adicionar_amigo():
    apelido = _json_objeto().get("apelido")
    if not isinstance(apelido, str):
        return jsonify({"error": "Informe um apelido válido"}), 400
    apelido = unicodedata.normalize("NFKC", apelido).strip()
    if not apelido or len(apelido) > 40 or any(ord(c) < 32 or ord(c) == 127 for c in apelido):
        return jsonify({"error": "Informe um apelido de 1 a 40 caracteres"}), 400
    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute("SELECT id_usuario FROM usuario WHERE email = %s", (g.email,))
            atual = cursor_sql.fetchone()
            cursor_sql.execute(
                "SELECT email, id_usuario FROM usuario "
                "WHERE LOWER(apelido) = LOWER(%s)",
                (apelido,),
            )
            encontrado = cursor_sql.fetchone()
            if encontrado is None:
                return jsonify({"error": "Nenhum usuário encontrado com esse apelido"}), 404
            if encontrado[0] == g.email:
                return jsonify({"error": "Você não pode se adicionar"}), 400
            cursor_sql.execute(
                "SELECT 1 FROM relacionamento WHERE usuario = %s AND amigo = %s",
                (atual[0], encontrado[1]),
            )
            if cursor_sql.fetchone():
                return jsonify({"error": "Essa pessoa já está na sua lista"}), 409
            cursor_sql.execute(
                "INSERT INTO relacionamento (usuario, amigo) VALUES (%s, %s), (%s, %s)",
                (atual[0], encontrado[1], encontrado[1], atual[0]),
            )
        conexao_bd.commit()
    return jsonify({"message": "Amigo adicionado"}), 201


@app.route("/senha/esqueci", methods=["POST"])
def solicitar_codigo_senha():
    dados = _json_objeto()
    email = _email_normalizado(dados.get("email"))
    chave = f"{request.remote_addr}:{email}"
    if not _limitar_tentativas(chave):
        return jsonify({"error": "Muitas tentativas. Aguarde 15 minutos."}), 429
    if email:
        codigo = f"{secrets.randbelow(1_000_000):06d}"
        hash_codigo = hashlib.sha256(codigo.encode("utf-8")).hexdigest()
        expira_em = (datetime.now(timezone.utc) + timedelta(minutes=5)).isoformat()
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute(
                    "UPDATE usuario SET token = %s WHERE email = %s",
                    (f"{hash_codigo},{expira_em}", email),
                )
                existe = cursor_sql.rowcount > 0
            conexao_bd.commit()
        if existe:
            try:
                _token_email(email, codigo)
            except (OSError, smtplib.SMTPException):
                app.logger.exception("Falha ao enviar código de recuperação")
    return jsonify({"message": "Se a conta existir, enviaremos um código de recuperação."})


@app.route("/senha/redefinir", methods=["POST"])
def redefinir_senha():
    dados = _json_objeto()
    email = _email_normalizado(dados.get("email"))
    codigo = dados.get("codigo")
    nova_senha = dados.get("nova_senha")
    chave = f"reset:{request.remote_addr}:{email}"
    if not _limitar_tentativas(chave):
        return jsonify({"error": "Muitas tentativas. Aguarde 15 minutos."}), 429
    if not isinstance(codigo, str) or not isinstance(nova_senha, str) or not Verificacoes.verificar_senha_forte(nova_senha):
        return jsonify({"error": "Código ou nova senha inválidos"}), 400
    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cursor_sql:
            cursor_sql.execute("SELECT token FROM usuario WHERE email = %s", (email,))
            linha = cursor_sql.fetchone()
            valido = False
            if linha and linha[0]:
                partes = linha[0].split(",", 1)
                if len(partes) == 2:
                    try:
                        expira = datetime.fromisoformat(partes[1])
                        if expira.tzinfo is None:
                            expira = expira.replace(tzinfo=timezone.utc)
                        valido = (
                            expira > datetime.now(timezone.utc)
                            and hmac.compare_digest(
                                partes[0],
                                hashlib.sha256(codigo.encode("utf-8")).hexdigest(),
                            )
                        )
                    except ValueError:
                        valido = False
            if not valido:
                return jsonify({"error": "Código inválido ou expirado"}), 400
            cursor_sql.execute(
                "UPDATE usuario SET senha = %s, token = NULL WHERE email = %s",
                (Criptografia.hash_senha(nova_senha), email),
            )
            cursor_sql.execute("DELETE FROM sessao WHERE email = %s", (email,))
        conexao_bd.commit()
    return jsonify({"message": "Senha redefinida com sucesso"})


@app.route("/health", methods=["GET"])
def verificar_saude():
    try:
        with conectar() as conexao_bd:
            with conexao_bd.cursor() as cursor_sql:
                cursor_sql.execute("SELECT 1")
    except (psycopg.Error, ErroConfiguracaoBanco):
        return jsonify({"status": "erro", "database": "indisponível"}), 503
    return jsonify({"status": "ok", "database": "PostgreSQL"})


@app.route("/admin/estatisticas", methods=["GET"])
@exigir_login
def estatisticas_administracao():
    if not Administrador.eh_admin(g.email):
        return jsonify({"error": "Acesso negado"}), 403
    return jsonify(PaginaAdministracao(g.email).estatisticas())


@app.route("/admin/usuarios", methods=["GET"])
@exigir_login
def listar_usuarios_administracao():
    if not Administrador.eh_admin(g.email):
        return jsonify({"error": "Acesso negado"}), 403
    return jsonify(PaginaAdministracao(g.email).listar_usuarios())


@app.route("/conteudo", methods=["GET"])
def listar_conteudo():
    return jsonify(Conteudo.listar_todos())


if __name__ == "__main__":
    app.run(
        debug=os.getenv("FLASK_DEBUG", "0") == "1",
        host=os.getenv("FLASK_HOST", "127.0.0.1"),
        port=int(os.getenv("FLASK_PORT", "5000")),
    )
