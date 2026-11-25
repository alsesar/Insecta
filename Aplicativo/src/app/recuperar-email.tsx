// Recebe o email da conta e solicita ao servidor um código de recuperação.
import { useTema } from "@/contextos/tema";
import { solicitarCodigoSenha } from "@/servicos/servico-api";
import { aviso } from "@/utilitarios/aviso";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Botao } from "@/componentes/botao";
import { CampoEntrada } from "@/componentes/campo-entrada";

export default function RecuperarEmail() {
  const { cores } = useTema();
  const [email, setEmail] = useState("");

  const verificarEmail = async () => {
    try {
      if (!email.trim()) {
        return aviso("Recuperar senha", "Digite seu email");
      }

      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
        aviso("Email", "Use um email válido");
        return;
      }

      // A resposta neutra evita revelar se o email possui uma conta.
      await solicitarCodigoSenha(email.trim().toLowerCase());
      aviso(
        "Recuperar senha",
        "Se o email estiver cadastrado, enviaremos um código de recuperação.",
      );

      // O email segue para a tela que valida o código recebido.
      router.push({
        pathname: "/redefinir-senha",
        params: { email: email.trim().toLowerCase() },
      });
    } catch (erro) {
      aviso(
        "Erro",
        erro instanceof Error
          ? erro.message
          : "Não foi possível verificar o email.",
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
            <Text style={[estilos.titulo, { color: cores.destaque }]}>
              Digite seu email
            </Text>
          </View>

          <Text style={[estilos.subtitulo, { color: cores.textoSecundario }]}>
            Diga-nos o email usado na sua conta
          </Text>

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

            <Botao rotulo="Enviar" onPress={verificarEmail} />
          </View>

          <Text style={[estilos.textoRodape, { color: cores.textoSecundario }]}>
            Lembrou?{" "}
            <Link
              href="/entrar"
              style={[estilos.atalhoRodape, { color: cores.destaque }]}
            >
              Volte aqui!
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
//css da tela
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
  textoRodape: {
    textAlign: "center",
    marginTop: 16,
  },
  atalhoRodape: {
    fontWeight: "700",
  },
});
