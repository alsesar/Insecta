// TELA DE INTRODUÇÃO AO NÍVEL (a tela que aparece antes da escolha do nível)
import { router } from "expo-router";
import { useTema } from "@/contextos/tema";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Botao } from "@/componentes/botao";

export default function NivelIntro() {
  const { cores } = useTema();
  const avancar = () => {
    router.push("/nivel");
  };
  // componentes da tela
  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <View style={estilos.conteiner}>
        <Image
          source={require("../assets/Joana/JoanaU3.png")}
          style={estilos.imagem}
        />
        <Text style={[estilos.titulo, { color: cores.destaque }]}>
          Vamos descobrir seu nível!
        </Text>
        <Botao rotulo="Avançar" onPress={avancar} />
      </View>
    </SafeAreaView>
  );
}
// css da tela
const estilos = StyleSheet.create({
  areaSegura: { flex: 1, backgroundColor: "#ffffff" },
  conteiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  imagem: {
    width: 250,
    height: 250,
  },
  titulo: {
    color: "#2400FF",
    fontSize: 24,
    fontFamily: "Baloo2_700Bold",
    textAlign: "center",
  },
});
