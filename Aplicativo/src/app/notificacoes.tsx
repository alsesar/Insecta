// Apresenta a área de notificações e oferece retorno à tela anterior.
import { Botao } from "@/componentes/botao";
import { useTema } from "@/contextos/tema";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notificacoes() {
  const { cores } = useTema();

  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <View style={estilos.conteiner}>
        <Text style={[estilos.titulo, { color: cores.texto }]}>
          Notificações
        </Text>
        <Text style={[estilos.mensagem, { color: cores.textoSecundario }]}>
          Você não tem nenhuma notificação.
        </Text>
        <Botao rotulo="Voltar" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: { flex: 1 },
  conteiner: { flex: 1, justifyContent: "center", padding: 24, gap: 20 },
  titulo: { fontSize: 26, fontFamily: "Baloo2_700Bold", textAlign: "center" },
  mensagem: { fontSize: 17, textAlign: "center", lineHeight: 24 },
});
