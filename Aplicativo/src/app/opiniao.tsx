// Coleta a opinião da pessoa e oferece ações para enviá-la ou compartilhá-la.
import { Botao } from "@/componentes/botao";
import { useTema } from "@/contextos/tema";
import { aviso } from "@/utilitarios/aviso";
import { router } from "expo-router";
import { useState } from "react";
import { Share, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TelaOpiniao() {
  const { cores } = useTema();
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function compartilharOpiniao() {
    const texto = mensagem.trim();
    if (!texto || enviando) return;

    setEnviando(true);
    try {
      const resultado = await Share.share({
        title: "Opinião sobre o Insecta",
        message: `Opinião sobre o Insecta:\n\n${texto}`,
      });
      if (resultado.action === Share.sharedAction) setMensagem("");
    } catch {
      aviso("Não foi possível compartilhar", "Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <View style={estilos.conteiner}>
        <Text style={[estilos.titulo, { color: cores.texto }]}>Opinião</Text>
        <Text style={[estilos.descricao, { color: cores.textoSecundario }]}>
          Conte o que podemos melhorar. Você poderá escolher um app para
          compartilhar sua mensagem.
        </Text>
        <TextInput
          value={mensagem}
          onChangeText={setMensagem}
          placeholder="Escreva sua mensagem"
          placeholderTextColor={cores.textoSecundario}
          multiline
          maxLength={1000}
          textAlignVertical="top"
          style={[
            estilos.campo,
            {
              backgroundColor: cores.superficie,
              borderColor: cores.borda,
              color: cores.texto,
            },
          ]}
        />
        <Text style={[estilos.contador, { color: cores.textoSecundario }]}>
          {mensagem.length}/1000
        </Text>
        <Botao
          rotulo={
            enviando ? "Abrindo compartilhamento..." : "Compartilhar opinião"
          }
          onPress={compartilharOpiniao}
          disabled={!mensagem.trim() || enviando}
        />
        <Botao
          rotulo="Voltar"
          onPress={() => router.back()}
          style={estilos.secundario}
        />
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: { flex: 1 },
  conteiner: { flex: 1, justifyContent: "center", padding: 24, gap: 14 },
  titulo: { fontSize: 28, fontFamily: "Baloo2_700Bold" },
  descricao: { fontSize: 15, lineHeight: 22 },
  campo: {
    minHeight: 180,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  contador: { textAlign: "right", fontSize: 12 },
  secundario: { backgroundColor: "#666675" },
});
