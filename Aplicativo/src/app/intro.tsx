// TELA DE INTRODUÇÃO (primeira tela de fato que o usuário vê ao abrir o app)
import { router } from "expo-router";
import { useTema } from "@/contextos/tema";
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

export default function Intro() {
  const { cores } = useTema();
  // função para avançar para a tela de login
  const avancar = () => {
    router.push("/entrar");
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
            <Text style={[estilos.titulo, { color: cores.destaque }]}>Olá!</Text>
            <Text style={[estilos.subtitulo, { color: cores.textoSecundario }]}>
              Bem vindo ao insecta! Seu novo app para aprender
            </Text>
            <Botao rotulo="Avançar" onPress={avancar} />
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
    fontFamily: "Baloo2_700Bold",
    fontSize: 30,
    opacity: 0.9,
    marginRight: 250,
  },

  subtitulo: {
    fontFamily: "Baloo2_400Regular",
    fontSize: 20,
    opacity: 0.6,
    marginBottom: 24,
    marginRight: 50,
    marginLeft: 20,
  },
});
