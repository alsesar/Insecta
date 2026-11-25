// Valida o código recebido e envia a nova senha ao servidor.
import { useTema } from "@/contextos/tema";
import { redefinirSenhaComCodigo } from "@/servicos/servico-api";
import { aviso } from "@/utilitarios/aviso";
import { senhaValida } from "@/utilitarios/senha";
import { router, useLocalSearchParams } from "expo-router";
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

export default function RecuperarSenha() {
  const { cores } = useTema();
  // O email chega como parâmetro da tela que solicitou o código.
  const { email } = useLocalSearchParams<{ email: string }>();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const redefinir = async () => {
    try {
      if (!email) {
        aviso("Erro", "Email não encontrado. Tente novamente.");
        router.replace("/recuperar-email");
        return;
      }

      if (!novaSenha.trim()) {
        return aviso("Recuperar senha", "Digite a nova senha");
      }

      if (!senhaValida(novaSenha)) {
        aviso(
          "Senha",
          "A senha precisa ter 8 caracteres, letras maiúsculas e minúsculas, números e caracteres especiais",
        );
        return;
      }

      if (novaSenha !== confirmarNovaSenha) {
        aviso("Senha", "As senhas não coincidem");
        return;
      }

      if (!codigo.trim()) {
        aviso("Recuperar senha", "Digite o código enviado para seu email.");
        return;
      }

      await redefinirSenhaComCodigo(email, codigo.trim(), novaSenha);

      aviso("Sucesso", "Senha redefinida! Faça login com a nova senha.");
      router.replace("/entrar");
    } catch (erro) {
      aviso(
        "Erro",
        erro instanceof Error
          ? erro.message
          : "Não foi possível redefinir a senha.",
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
              Digite sua nova senha
            </Text>
          </View>

          <Text style={[estilos.subtitulo, { color: cores.textoSecundario }]}>
            Digite o código enviado para o seu email e crie uma nova senha
          </Text>

          <View style={estilos.formulario}>
            <Text style={[estilos.rotulo, { color: cores.textoSecundario }]}>
              Código:
            </Text>
            <CampoEntrada
              placeholder="Código recebido por email"
              placeholderTextColor="#B0B0B8"
              keyboardType="number-pad"
              value={codigo}
              onChangeText={setCodigo}
            />
            <Text style={[estilos.rotulo, { color: cores.textoSecundario }]}>
              Senha:
            </Text>
            <View style={estilos.entradaComIcone}>
              <CampoEntrada
                placeholder="#Exemplo123"
                placeholderTextColor="#B0B0B8"
                secureTextEntry={!mostrarSenha}
                value={novaSenha}
                onChangeText={setNovaSenha}
              />
              <TouchableOpacity
                onPress={() => setMostrarSenha(!mostrarSenha)}
                style={estilos.botaoVisibilidadeSenha}
              >
                <Image
                  source={
                    mostrarSenha
                      ? require("../assets/Icons/eye.png")
                      : require("../assets/Icons/show.png")
                  }
                  style={estilos.iconeOlho}
                />
              </TouchableOpacity>
            </View>

            <Text style={[estilos.rotulo, { color: cores.textoSecundario }]}>
              Confirmar senha:
            </Text>
            <View style={estilos.entradaComIcone}>
              <CampoEntrada
                placeholder="#Exemplo123"
                placeholderTextColor="#B0B0B8"
                secureTextEntry={!mostrarConfirmar}
                value={confirmarNovaSenha}
                onChangeText={setConfirmarNovaSenha}
              />
              <TouchableOpacity
                onPress={() => setMostrarConfirmar(!mostrarConfirmar)}
                style={estilos.botaoVisibilidadeSenha}
              >
                <Image
                  source={
                    mostrarConfirmar
                      ? require("../assets/Icons/eye.png")
                      : require("../assets/Icons/show.png")
                  }
                  style={estilos.iconeOlho}
                />
              </TouchableOpacity>
            </View>

            <Botao rotulo="Redefinir Senha" onPress={redefinir} />
          </View>
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
  entradaComIcone: {
    flexDirection: "row",
    alignItems: "center",
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
});
