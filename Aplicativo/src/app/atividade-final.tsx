// Apresenta o resultado da atividade quando a pontuação mínima não é atingida.
import { router } from "expo-router";
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
import { useTema } from "@/contextos/tema";

export default function TelaFalhaAtividade() {
  const { cores } = useTema();
  // função para avançar para a tela de login
  const voltar = () => {
    router.push("/nivel");
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
          <View style={estilos.conteudo}>
            <Image
              source={require("../assets/Joana/JoanaBm.gif")}
              style={estilos.imagem}
            />
            <Text style={[estilos.titulo, { color: cores.destaque }]}>
              Caramba!
            </Text>
            <Text style={[estilos.subtitulo, { color: cores.textoSecundario }]}>
              É, você não deveria estar aqui ainda. Mas tudo bem, vamos te levar
              de volta para a tela de escolha de nível.
            </Text>
            <Botao rotulo="Voltar" onPress={voltar} />
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
    backgroundColor: "#ffffff",
  },

  conteudoRolavel: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  conteudo: {
    alignItems: "center",
  },

  imagem: {
    width: 250,
    height: 250,
    marginTop: 10,
    marginBottom: 16,
  },

  titulo: {
    color: "#243AA9",
    fontFamily: "Baloo2_700Bold",
    fontSize: 30,
    opacity: 0.9,
    marginRight: 175,
  },

  subtitulo: {
    color: "#243AA9",
    fontFamily: "Baloo2_400Regular",
    fontSize: 20,
    opacity: 0.6,
    marginBottom: 24,
    marginRight: 50,
    marginLeft: 20,
  },
});
