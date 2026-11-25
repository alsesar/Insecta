// TELA DE TRANSIÇÃO (mensagem de introdução antes do usuário começar a responder as perguntas)
import { router, useLocalSearchParams } from "expo-router";
import { useTema } from "@/contextos/tema";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Botao } from "@/componentes/botao";

export default function NivelTransicao() {
  const { cores } = useTema();
  const { nivelPretendido } = useLocalSearchParams<{
    nivelPretendido: "intermediario" | "avancado";
  }>();

  const comecar = () => {
    router.push({
      pathname: "/atividade",
      params: { nivelPretendido },
    });
  };
  // componentes da tela
  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <View style={estilos.conteiner}>
        <Text style={[estilos.titulo, { color: cores.destaque }]}>
          Hora de provar seu nível!
        </Text>
        <Text style={[estilos.subtitulo, { color: cores.textoSecundario }]}>
          Responda algumas perguntas, só para confirmar seu nível:{" "}
          {nivelPretendido === "avancado" ? "avançado" : "intermediário"}. Se
          não for, sem problema, a gente ajusta seu nível.
        </Text>
        <Botao rotulo="Começar" onPress={comecar} />
      </View>
    </SafeAreaView>
  );
}
// css da tela
const estilos = StyleSheet.create({
  areaSegura: { flex: 1, backgroundColor: "#ffffff" },
  conteiner: { flex: 1, justifyContent: "center", padding: 24, gap: 16 },
  titulo: {
    color: "#2400FF",
    fontSize: 24,
    fontFamily: "Baloo2_700Bold",
    textAlign: "center",
  },
  subtitulo: {
    color: "#2400FF",
    fontSize: 16,
    fontFamily: "Baloo2_400Regular",
    opacity: 0.7,
    textAlign: "center",
  },
});
