"""Testa contratos HTTP importantes sem depender de um banco real."""

import pytest

from app import app


@pytest.fixture()
def cliente():
    app.config.update(TESTING=True)
    with app.test_client() as cliente_http:
        yield cliente_http


def test_rota_protegida_exige_token_bearer(cliente):
    resposta = cliente.get("/me")

    assert resposta.status_code == 401
    assert resposta.get_json() == {"error": "Autenticação necessária"}


def test_acesso_rejeita_credenciais_ausentes_sem_banco(cliente):
    resposta = cliente.post("/login", json={})

    assert resposta.status_code == 401
    assert resposta.get_json() == {"error": "Email ou senha incorretos"}


def test_cadastro_rejeita_senha_fraca_antes_do_banco(cliente):
    resposta = cliente.post(
        "/signup",
        json={"nome": "Teste", "email": "teste@example.com", "senha": "fraca"},
    )

    assert resposta.status_code == 400
    assert "senha" in resposta.get_json()["error"].lower()


def test_recuperacao_nao_revela_se_a_conta_existe(cliente):
    resposta = cliente.post("/senha/esqueci", json={})

    assert resposta.status_code == 200
    assert "Se a conta existir" in resposta.get_json()["message"]


@pytest.mark.parametrize(
    "origem",
    ["http://localhost:8081", "http://127.0.0.1:8081"],
)
def test_previa_cors_permite_autenticacao_e_metodos(
    cliente, monkeypatch, origem
):
    monkeypatch.setenv("CORS_ORIGIN", "http://localhost:8081")
    resposta = cliente.options(
        "/me",
        headers={
            "Origin": origem,
            "Access-Control-Request-Method": "PATCH",
            "Access-Control-Request-Headers": "authorization,content-type",
        },
    )

    assert resposta.status_code == 200
    assert resposta.headers["Access-Control-Allow-Origin"] == origem
    assert "Authorization" in resposta.headers["Access-Control-Allow-Headers"]
    assert "PATCH" in resposta.headers["Access-Control-Allow-Methods"]
