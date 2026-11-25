// Centraliza as chamadas HTTP, a autenticação e a conversão de erros da API.
import { Platform } from "react-native";
import { router } from "expo-router";
import { limparSessao, lerToken } from "@/servicos/sessao";

export const ENDERECO_DA_API =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  (Platform.OS === "android"
    ? "http://10.0.2.2:5000"
    : "http://127.0.0.1:5000");

export type UsuarioDaApi = {
  id_usuario: string;
  email: string;
  nome: string;
  apelido: string | null;
  nivel: string | null;
  foto_url: string | null;
};

export type PerfilDoUsuario = {
  usuario: UsuarioDaApi;
  progresso: Record<string, number>;
};

export type AmigoDoRanking = {
  id_usuario: string;
  apelido: string;
  atividadesConcluidas: number;
  usuarioAtual: boolean;
};

export class ErroDaApi extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ErroDaApi";
  }
}

function objeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

async function requisicao<T>(
  rota: string,
  opcoes: {
    metodo?: string;
    corpo?: unknown;
    auth?: boolean;
    arquivo?: FormData;
  } = {},
): Promise<T> {
  const controlador = new AbortController();
  const timeout = setTimeout(() => controlador.abort(), 10_000);
  const headers: Record<string, string> = {};
  if (!opcoes.arquivo && opcoes.corpo !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  try {
    if (opcoes.auth !== false) {
      const token = await lerToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    const resposta = await fetch(`${ENDERECO_DA_API}${rota}`, {
      method: opcoes.metodo ?? "GET",
      headers,
      body: opcoes.arquivo ?? (
        opcoes.corpo === undefined ? undefined : JSON.stringify(opcoes.corpo)
      ),
      signal: controlador.signal,
    });
    const texto = await resposta.text();
    let resultado: unknown = undefined;
    if (texto) {
      try {
        resultado = JSON.parse(texto) as unknown;
      } catch {
        resultado = undefined;
      }
    }

    if (!resposta.ok) {
      const mensagem =
        objeto(resultado) && typeof resultado.error === "string"
          ? resultado.error
          : `Falha na API (${resposta.status}).`;
      if (resposta.status === 401 && opcoes.auth !== false) {
        await limparSessao();
        router.replace("/entrar");
      }
      throw new ErroDaApi(mensagem, resposta.status);
    }
    return resultado as T;
  } catch (erro) {
    if (erro instanceof ErroDaApi) throw erro;
    const detalhe =
      erro instanceof Error && erro.name === "AbortError"
        ? "O servidor demorou para responder."
        : "Não foi possível conectar ao servidor.";
    throw new ErroDaApi(`${detalhe} Endereço da API: ${ENDERECO_DA_API}`);
  } finally {
    clearTimeout(timeout);
  }
}

export async function cadastrarUsuario(
  nome: string,
  email: string,
  senha: string,
) {
  return requisicao<{ message: string }>("/signup", {
    metodo: "POST",
    corpo: { nome, email, senha },
    auth: false,
  });
}

export async function autenticarUsuario(email: string, senha: string) {
  return requisicao<{ token: string; expira_em: string; usuario: UsuarioDaApi }>(
    "/login",
    { metodo: "POST", corpo: { email, senha }, auth: false },
  );
}

export async function encerrarSessaoApi() {
  return requisicao<void>("/logout", { metodo: "POST" });
}

export async function carregarPerfilUsuario() {
  return requisicao<PerfilDoUsuario>("/me");
}

export async function atualizarPerfil(dados: {
  apelido?: string;
  nivel?: string;
}) {
  return requisicao<{ usuario: UsuarioDaApi }>("/me", {
    metodo: "PATCH",
    corpo: dados,
  });
}

export async function carregarProgressoAtividades() {
  return requisicao<Record<string, number>>("/progresso");
}

export async function salvarProgressoAtividade(
  id: number,
  percentual: number,
) {
  return requisicao<{ progresso: Record<string, number> }>(
    `/progresso/${id}`,
    { metodo: "PUT", corpo: { percentual } },
  );
}

export async function carregarRankingSocial() {
  return requisicao<AmigoDoRanking[]>("/social/ranking");
}

export async function adicionarAmigoPorApelido(apelido: string) {
  return requisicao<{ message: string }>("/social/amigos", {
    metodo: "POST",
    corpo: { apelido },
  });
}

export async function solicitarCodigoSenha(email: string) {
  return requisicao<{ message: string }>("/senha/esqueci", {
    metodo: "POST",
    corpo: { email },
    auth: false,
  });
}

export async function redefinirSenhaComCodigo(
  email: string,
  codigo: string,
  nova_senha: string,
) {
  return requisicao<{ message: string }>("/senha/redefinir", {
    metodo: "POST",
    corpo: { email, codigo, nova_senha },
    auth: false,
  });
}

export async function enviarFotoPerfil(
  uri: string,
  nome: string,
  tipo: string,
) {
  const arquivo = new FormData();
  if (Platform.OS === "web") {
    const imagem = await fetch(uri).then((resposta) => resposta.blob());
    arquivo.append("foto", imagem, nome);
  } else {
    arquivo.append(
      "foto",
      { uri, name: nome, type: tipo } as unknown as Blob,
    );
  }
  return requisicao<{ foto_url: string }>("/me/foto", {
    metodo: "PUT",
    arquivo,
  });
}

export function urlFotoPerfil(caminho: string | null) {
  return caminho ? `${ENDERECO_DA_API}${caminho}` : null;
}
