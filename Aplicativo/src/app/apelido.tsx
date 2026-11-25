// Define o apelido do perfil e envia a alteração para o servidor.
import { useTema } from "@/contextos/tema";
import { atualizarPerfil, ErroDaApi } from "@/servicos/servico-api";
import { aviso } from "@/utilitarios/aviso";
import { router } from "expo-router";
import { useState } from "react";
import {
    Image,
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

export default function TelaApelido() {
  const { cores } = useTema();
  const [id_usuario, setApelido] = useState("");

  // Salva o apelido no servidor antes de avançar.
  async function continuar() {
    try {
      if (!id_usuario.trim()) {
        aviso("Apelido", "Digite um apelido para continuar.");
        return;
      }
      await atualizarPerfil({ apelido: id_usuario.trim() });
    } catch (erro) {
      if (erro instanceof ErroDaApi && erro.status === 409) {
        aviso("Apelido", "Esse apelido já está em uso.");
        return;
      }
      aviso(
        "Erro",
        erro instanceof Error
          ? erro.message
          : "Não foi possível salvar o apelido.",
      );
      return;
    }
    // Depois de salvar o apelido, encaminha para a avaliação inicial.
    router.push("/nivel-intro");
  }
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
          <Image
            source={require("../assets/Joana/JoanaLmi.gif")}
            style={estilos.imagem}
          />
          <View style={estilos.conteiner}>
            <Text style={[estilos.titulo, { color: cores.destaque }]}>
              Como podemos te chamar?
            </Text>
            <Text style={[estilos.rotulo, { color: cores.textoSecundario }]}>
              Apelido:
            </Text>
            <CampoEntrada
              placeholder="Seu apelido"
              placeholderTextColor="#B0B0B8"
              autoCapitalize="none"
              onChangeText={setApelido}
              value={id_usuario}
            />
            <Botao rotulo="Continuar" onPress={continuar} />
          </View>
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

  imagem: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },

  cabecalho: {
    marginBottom: 8,
  },

  conteiner: {
    gap: 12,
  },

  titulo: {
    fontSize: 28,
    fontFamily: "Baloo2_700Bold",
    opacity: 0.9,
    marginLeft: 7,
  },

  rotulo: {
    fontSize: 14,
    fontFamily: "600",
    opacity: 0.8,
    marginLeft: 9,
  },
});
