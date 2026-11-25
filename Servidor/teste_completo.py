#!/usr/bin/env python3
"""Teste completo de todos os módulos do Servidor contra o banco DB."""
import sys
import uuid
import warnings

warnings.filterwarnings("ignore")


def titulo(s):
    print(f"\n{'='*62}\n  {s}\n{'='*62}")


def executar(nome, funcao):
    try:
        funcao()
        print(f"  ✅ {nome}")
        return True
    except Exception as e:
        print(f"  ❌ {nome}: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False


# Dados únicos para não conflitar com o que já existe no banco
SUFIXO = uuid.uuid4().hex[:8]
EMAIL = f"teste_{SUFIXO}@example.com"
ID_USUARIO = f"user_{SUFIXO}"
SENHA = "SenhaForte123!"
NIVEL = f"nivel_{SUFIXO}"
TITULO = f"Titulo_{SUFIXO}"

resultados = []

# ---------------------------------------------------------------- 1
titulo("1. IMPORTAÇÃO DOS MÓDULOS")
def verificar_imports():
    import conexao, criptografia, seguranca, verificacao
    import cadastro, autenticacao, pagina_usuario, token_insecta
    import administrador, conteudo, permissoes, pagina_administracao
resultados.append(("Importação", executar("todos os módulos importam", verificar_imports)))

# ---------------------------------------------------------------- 2
titulo("2. CONEXÃO COM O BANCO DB")
def verificar_conexao():
    import conexao
    with conexao.conectar() as conexao_bd:
        with conexao_bd.cursor() as cur:
            cur.execute("SELECT current_database(), current_user")
            db, usr = cur.fetchone()
            assert db == "DB", f"Banco atual = {db!r}"
            assert usr == "Felip3__u", f"Usuário atual = {usr!r}"
resultados.append(("Conexão", executar("conectar() retorna DB como Felip3__u", verificar_conexao)))

# ---------------------------------------------------------------- 3
titulo("3. CRIPTOGRAFIA")
def verificar_cripto():
    from criptografia import Criptografia
    h = Criptografia.hash_senha(SENHA)
    assert h != SENHA
    assert Criptografia.verificar_senha(SENHA, h)
    assert not Criptografia.verificar_senha("errada", h)
resultados.append(("Criptografia", executar("hash, verificação e rejeição", verificar_cripto)))

# ---------------------------------------------------------------- 4
titulo("4. SEGURANÇA (SQL INJECTION)")
def verificar_seguranca():
    from seguranca import FiltroDePadroesSql
    for s in ["Felipe Santos", "alice@example.com", "Senha123!", "user_abc"]:
        assert FiltroDePadroesSql.verificacao(s), f"Deveria aceitar {s!r}"
    for s in ["' OR 1=1 --", "'; DROP TABLE usuario; --", "1=1 OR 1=1"]:
        assert not FiltroDePadroesSql.verificacao(s), f"Deveria bloquear {s!r}"
resultados.append(("Segurança", executar("aceita legítimos, bloqueia injeções", verificar_seguranca)))

# ---------------------------------------------------------------- 5
titulo("5. VERIFICAÇÕES (senha forte, igualdade, campos)")
def verificar_verif():
    from verificacao import Verificacoes as V
    assert V.verificar_senha_forte("Capivara123!")
    assert not V.verificar_senha_forte("123")
    assert not V.verificar_senha_forte("senhafraca")
    assert V.verificar_senha_igual("a", "a")
    assert not V.verificar_senha_igual("a", "b")
    assert V.verificar_campos("x")
    assert not V.verificar_campos("   ")
resultados.append(("Verificações", executar("todas as regras", verificar_verif)))

# ---------------------------------------------------------------- 6
titulo("6. CADASTRO")
def verificar_cadastro():
    from cadastro import Cadastro
    r = Cadastro("Usuario Teste", EMAIL, ID_USUARIO, SENHA).usuario()
    assert r is True, f"Cadastro retornou {r!r}"
resultados.append(("Cadastro", executar(f"cadastra {EMAIL}", verificar_cadastro)))

# ---------------------------------------------------------------- 7
titulo("7. LOGIN")
def verificar_autenticacao():
    from autenticacao import Autenticacao
    assert Autenticacao(EMAIL, SENHA).usuario() is True, "Credencial correta rejeitada"
    assert Autenticacao(EMAIL, "senhaerrada").usuario() is False, "Senha incorreta aceita"
resultados.append(("Autenticação", executar("aceita credenciais corretas e rejeita incorretas", verificar_autenticacao)))

# ---------------------------------------------------------------- 8
titulo("8. PÁGINA USUÁRIO")
def verificar_pagina_usuario():
    from pagina_usuario import Inicial
    dados = Inicial(EMAIL).dados()
    assert dados is not None
    assert dados["email"] == EMAIL
    assert dados["id_usuario"] == ID_USUARIO
resultados.append(("Página usuário", executar("Inicial.dados()", verificar_pagina_usuario)))

# ---------------------------------------------------------------- 9
titulo("9. TOKEN")
def verificar_token():
    from token_insecta import Codigo
    c = Codigo()
    codigo = c.token_email(EMAIL)
    assert len(codigo) == 6, f"Token = {codigo!r} (esperado 6 chars)"
    codigo2 = c.enviar_codigo(EMAIL)   # token ainda válido → retorna o mesmo
    assert len(codigo2) == 6
resultados.append(("Token", executar("gerar e reutilizar código válido", verificar_token)))

# ---------------------------------------------------------------- 10
titulo("10. ADM")
def verificar_administrador():
    from administrador import Administrador
    assert Administrador(EMAIL, 5).promover() is True
    assert Administrador.eh_admin(EMAIL) is True
    assert Administrador.nivel_de(EMAIL) == 5
    assert Administrador.nivel_de("nao_existe@x.com") is None
    assert any(x["email"] == EMAIL for x in Administrador.listar_todos())
resultados.append(("Administrador", executar("promover, verificar e listar", verificar_administrador)))

# ---------------------------------------------------------------- 11
titulo("11. PERMISSÕES")
def verificar_permissoes():
    from permissoes import Permissoes
    assert Permissoes.conceder(EMAIL, "gerenciar_conteudo") is True
    assert Permissoes.tem_permissao(EMAIL, "gerenciar_conteudo") is True
    assert "gerenciar_conteudo" in Permissoes.listar_por_email(EMAIL)
    assert Permissoes.revogar(EMAIL, "gerenciar_conteudo") is True
    assert Permissoes.tem_permissao(EMAIL, "gerenciar_conteudo") is False
resultados.append(("Permissões", executar("conceder, verificar e revogar", verificar_permissoes)))

# ---------------------------------------------------------------- 12
titulo("12. CONTEÚDO")
def verificar_conteudo():
    from conteudo import Conteudo
    c = Conteudo(titulo=TITULO, conteudo="Texto de teste", nivel=NIVEL, gabarito="A")
    assert c.criar() is True
    assert Conteudo.buscar_por_titulo(TITULO) is not None
    assert Conteudo.buscar_por_nivel(NIVEL) is not None
    assert any(x["titulo"] == TITULO for x in Conteudo.listar_todos())
resultados.append(("Conteúdo", executar("criar, buscar e listar", verificar_conteudo)))

# ---------------------------------------------------------------- 13
titulo("13. PÁGINA ADM (dashboard)")
def verificar_pagina_adm():
    from pagina_administracao import PaginaAdministracao
    p = PaginaAdministracao(EMAIL)
    stats = p.estatisticas()
    assert "total_usuarios" in stats
    assert stats["total_usuarios"] >= 1
    assert isinstance(p.listar_usuarios(limite=10), list)
    det = p.detalhes_usuario(EMAIL)
    assert det is not None
    assert det["nivel_acesso"] == 5
    assert any(x["email"] == EMAIL for x in p.ultimos_cadastros(5))
resultados.append(("Página ADM", executar("estatísticas + detalhes + listas", verificar_pagina_adm)))

# ---------------------------------------------------------------- LIMPEZA
titulo("LIMPEZA DOS DADOS DE TESTE")
try:
    from conexao import conectar
    with conectar() as conexao_bd:
        with conexao_bd.cursor() as cur:
            cur.execute("DELETE FROM conteudo WHERE titulo = %s", (TITULO,))
            cur.execute("DELETE FROM adm WHERE email = %s", (EMAIL,))
            cur.execute("DELETE FROM usuario WHERE email = %s", (EMAIL,))
        conexao_bd.commit()
    print(f"  🧹 removido usuário {EMAIL}, admin e conteúdo de teste")
except Exception as e:
    print(f"  ⚠️ limpeza falhou: {e}")

# ---------------------------------------------------------------- RESUMO
titulo("RESUMO FINAL")
total = len(resultados)
passou = sum(1 for _, r in resultados if r)
for nome, r in resultados:
    print(f"  {'✅' if r else '❌'}  {nome}")
print(f"\n  {passou}/{total} grupos passaram")
sys.exit(0 if passou == total else 1)
