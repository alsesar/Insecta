// Apresenta informações institucionais sobre o aplicativo Insecta.
import { Botao } from "@/componentes/botao";
import { useTema } from "@/contextos/tema";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Sobre() {
  const { cores } = useTema();

  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <ScrollView contentContainerStyle={estilos.conteiner}>
        <Text style={[estilos.titulo, { color: cores.texto }]}>
          Sobre o Insecta
        </Text>
        <Text style={[estilos.paragrafo, { color: cores.textoSecundario }]}>
          O Insecta é um aplicativo de aprendizagem criado para ajudar você a
          desenvolver conhecimentos de informática e cidadania digital no seu
          próprio ritmo.
        </Text>
        <Text style={[estilos.paragrafo, { color: cores.textoSecundario }]}>
          As atividades apresentam temas como componentes do computador,
          segurança na internet, organização de arquivos e comunicação digital.
          Cada etapa combina conteúdo e perguntas para acompanhar o que você
          aprendeu.
        </Text>
        <Text style={[estilos.paragrafo, { color: cores.textoSecundario }]}>
          Seu progresso fica associado à sua conta neste dispositivo. Conclua
          uma atividade para liberar a próxima e continuar sua jornada.
        </Text>
        <Botao rotulo="Voltar" onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: { flex: 1 },
  conteiner: { flexGrow: 1, justifyContent: "center", padding: 24, gap: 20 },
  titulo: { fontSize: 28, fontFamily: "Baloo2_700Bold" },
  paragrafo: { fontSize: 16, lineHeight: 25 },
});
