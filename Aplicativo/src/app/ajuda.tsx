// Exibe orientações básicas e permite voltar à tela de origem.
import { Botao } from "@/componentes/botao";
import { useTema } from "@/contextos/tema";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Ajuda() {
  const { cores } = useTema();

  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <View style={estilos.conteiner}>
        <Text style={[estilos.titulo, { color: cores.texto }]}>Ajuda</Text>
        <View style={[estilos.item, { backgroundColor: cores.superficieSuave }]}>
          <Text style={[estilos.pergunta, { color: cores.texto }]}>
            Como avanço?
          </Text>
          <Text style={[estilos.resposta, { color: cores.textoSecundario }]}>
            Responda às perguntas e alcance pelo menos 60% de acertos para
            concluir a atividade e desbloquear a próxima.
          </Text>
        </View>
        <View style={[estilos.item, { backgroundColor: cores.superficieSuave }]}>
          <Text style={[estilos.pergunta, { color: cores.texto }]}>
            Onde vejo meu progresso?
          </Text>
          <Text style={[estilos.resposta, { color: cores.textoSecundario }]}>
            O círculo de cada atividade e a barra no topo mostram seu progresso.
            Ele é salvo na sua conta neste dispositivo.
          </Text>
        </View>
        <TouchableOpacity
          style={[estilos.item, { backgroundColor: cores.superficieSuave }]}
          onPress={() => router.push("/notificacoes")}
        >
          <Text style={[estilos.link, { color: cores.destaque }]}>
            Ver notificações
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.item, { backgroundColor: cores.superficieSuave }]}
          onPress={() => router.push("/opiniao")}
        >
          <Text style={[estilos.link, { color: cores.destaque }]}>
            Enviar opinião
          </Text>
        </TouchableOpacity>
        <Botao rotulo="Voltar" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: { flex: 1 },
  conteiner: { flex: 1, justifyContent: "center", padding: 24, gap: 14 },
  titulo: { fontSize: 28, fontFamily: "Baloo2_700Bold", marginBottom: 4 },
  item: { padding: 16, borderRadius: 8, gap: 6 },
  pergunta: { fontSize: 16, fontWeight: "700" },
  resposta: { fontSize: 14, lineHeight: 21 },
  link: { fontSize: 15, fontWeight: "700" },
});
