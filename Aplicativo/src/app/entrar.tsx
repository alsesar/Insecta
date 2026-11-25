// Reúne o formulário de acesso e envia as credenciais ao serviço da API.
import { useTema } from "@/contextos/tema";
import { autenticarUsuario } from "@/servicos/servico-api";
import { salvarToken } from "@/servicos/sessao";
import { aviso } from "@/utilitarios/aviso";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Botao } from "@/componentes/botao";
import { CampoEntrada } from "@/componentes/campo-entrada";

export default function TelaEntrar() {
  const { cores } = useTema();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrar, setMostrar] = useState(false);

  // Lógica para validar o formulário antes de avançar
  const entrar = async () => {
    try {
      if (!email.trim() || !senha.trim()) {
        return aviso("Entrar", "Preencha email e senha para entrar");
      }
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!regex.test(email.trim())) {
        aviso("Email", "Use um email válido");
        return;
      }

      const sessao = await autenticarUsuario(email.trim(), senha);
      await salvarToken(sessao.token);

      router.push("/apelido");
    } catch (erro) {
      aviso(
        "Erro",
        erro instanceof Error ? erro.message : "Não foi possível entrar.",
      );
    }
  };
  // componentes da tela
  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: "height" })}
      >
        <ScrollView
          contentContainerStyle={estilos.conteudoRolavel}
          keyboardShouldPersistTaps="handled"
        >
          <View style={estilos.cabecalho}>
            <Text style={[estilos.titulo, { color: cores.destaque }]}>Entrar</Text>
            <Text style={[estilos.subtitulo, { color: cores.textoSecundario }]}>
              Faça login e comece agora!
            </Text>
          </View>

          <View style={estilos.formulario}>
            <Text style={[estilos.rotulo, { color: cores.textoSecundario }]}>
              Email:
            </Text>
            <CampoEntrada
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#B0B0B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={[estilos.rotulo, { color: cores.textoSecundario }]}>
              Senha:
            </Text>
            <View style={estilos.entradaComIcone}>
              <CampoEntrada
                placeholder="#Exemplo123"
                placeholderTextColor="#B0B0B8"
                secureTextEntry={!mostrar}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity
                onPress={() => setMostrar(!mostrar)}
                style={estilos.botaoVisibilidadeSenha}
              >
                <Image
                  source={
                    mostrar
                      ? require("../assets/Icons/eye.png")
                      : require("../assets/Icons/show.png")
                  }
                  style={estilos.iconeOlho}
                />
              </TouchableOpacity>
            </View>

            <Text style={[estilos.textoRodape, { color: cores.textoSecundario }]}>
              Esqueceu a senha?{" "}
              <Link
                href="/recuperar-email"
                style={[estilos.atalhoRodape, { color: cores.destaque }]}
              >
                Clique aqui!
              </Link>
            </Text>
            <Botao rotulo="Entrar" onPress={entrar} />
          </View>

          <Text style={[estilos.textoRodape, { color: cores.textoSecundario }]}>
            Não tem uma conta?{" "}
            <Link
              href="/cadastro"
              style={[estilos.atalhoRodape, { color: cores.destaque }]}
            >
              Crie aqui!
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
// css da tela
const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
  },

  conteudoRolavel: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  cabecalho: {
    marginBottom: 8,
  },

  titulo: {
    fontSize: 28,
    fontFamily: "Baloo2_700Bold",
    opacity: 0.9,
    marginLeft: 7,
  },

  subtitulo: {
    fontSize: 20,
    marginBottom: 24,
    fontFamily: "Baloo2_400Regular",
    opacity: 0.6,
    marginLeft: 7,
  },

  formulario: {
    gap: 12,
  },

  rotulo: {
    fontSize: 14,
    fontFamily: "600",
    opacity: 0.8,
    marginLeft: 9,
  },

  entradaComIcone: {
    flexDirection: "row",
    alignItems: "center",
  },

  entradaInterna: {
    flex: 1,
  },

  botaoVisibilidadeSenha: {
    position: "absolute",
    right: 12,
    padding: 4,
  },

  iconeOlho: {
    width: 20,
    height: 20,
  },

  forgotText: {
    color: "# ",
    fontSize: 13,
    textAlign: "right",
  },

  textoRodape: {
    textAlign: "center",
  },

  atalhoRodape: {
    fontWeight: "700",
  },
});
