// Mantém o token de autenticação local para as próximas chamadas à API.
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_SESSAO = "sessaoToken";

export async function salvarToken(token: string) {
  await AsyncStorage.setItem(CHAVE_SESSAO, token);
}

export async function lerToken() {
  return AsyncStorage.getItem(CHAVE_SESSAO);
}

export async function limparSessao() {
  await AsyncStorage.removeItem(CHAVE_SESSAO);
}
