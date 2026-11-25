// Conduz o questionário selecionado e envia ao servidor o progresso concluído.
import { Botao } from "@/componentes/botao";
import { MultiplaEscolha } from "@/componentes/multipla-escolha";
import { useTema } from "@/contextos/tema";
import { perguntasPorAtividade } from "@/dados/perguntas";
import { salvarProgressoAtividade } from "@/servicos/servico-api";
import { aviso } from "@/utilitarios/aviso";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NOTA_MINIMA = 60;

export default function QuestionarioAtividade() {
  const { cores } = useTema();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idAtividade = Number(id);
  const perguntas = perguntasPorAtividade[idAtividade] ?? [];
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [resultado, setResultado] = useState<"aprovado" | "reprovado" | null>(
    null,
  );

  if (perguntas.length === 0) {
    return (
      <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
        <View style={estilos.conteiner}>
          <Text style={[estilos.titulo, { color: cores.destaque }]}>
            Atividade não encontrada
          </Text>
          <Botao rotulo="Voltar" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const perguntaAtual = perguntas[indiceAtual];
  const ultimaPergunta = indiceAtual === perguntas.length - 1;

  async function responder(indiceEscolhido: number) {
    const novosAcertos =
      indiceEscolhido === perguntaAtual.respostaCorreta ? acertos + 1 : acertos;
    const percentual = Math.min(
      99,
      Math.round((novosAcertos / perguntas.length) * 100),
    );

    try {
      await salvarProgressoAtividade(idAtividade, percentual);
    } catch {
      aviso("Erro", "Não foi possível salvar seu progresso.");
      return;
    }

    if (ultimaPergunta) {
      setAcertos(novosAcertos);
      if ((novosAcertos / perguntas.length) * 100 >= NOTA_MINIMA) {
        try {
          await salvarProgressoAtividade(idAtividade, 100);
          setResultado("aprovado");
        } catch {
          aviso("Erro", "Não foi possível registrar a conclusão.");
        }
      } else {
        setResultado("reprovado");
      }
      return;
    }

    setAcertos(novosAcertos);
    setIndiceAtual(indiceAtual + 1);
  }

  function tentarNovamente() {
    setIndiceAtual(0);
    setAcertos(0);
    setResultado(null);
  }

  function voltarParaAtividades() {
    router.dismissTo("/(tabs)");
  }

  const nota = Math.round((acertos / perguntas.length) * 100);

  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <View style={estilos.conteiner}>
        {resultado ? (
          <View style={estilos.resultado}>
            <Text style={[estilos.titulo, { color: cores.destaque }]}>
              {resultado === "aprovado" ? "Muito bem!" : "Quase lá!"}
            </Text>
            <Text
              style={[estilos.textoResultado, { color: cores.textoSecundario }]}
            >
              Você acertou {acertos} de {perguntas.length} perguntas ({nota}%).
            </Text>
            <Text
              style={[estilos.textoResultado, { color: cores.textoSecundario }]}
            >
              {resultado === "aprovado"
                ? "Atividade concluída. A próxima atividade foi desbloqueada."
                : `Você precisa de pelo menos ${NOTA_MINIMA}% para concluir.`}
            </Text>
            {resultado === "aprovado" ? (
              <Botao
                rotulo="Voltar para atividades"
                onPress={voltarParaAtividades}
              />
            ) : (
              <>
                <Botao rotulo="Tentar novamente" onPress={tentarNovamente} />
                <Botao
                  rotulo="Voltar para atividades"
                  onPress={voltarParaAtividades}
                  style={estilos.botaoSecundario}
                />
              </>
            )}
          </View>
        ) : (
          <>
            <Text style={[estilos.progresso, { color: cores.textoSecundario }]}>
              Pergunta {indiceAtual + 1} de {perguntas.length}
            </Text>
            <MultiplaEscolha
              pergunta={perguntaAtual}
              onResponder={responder}
              ultimaDaLista={ultimaPergunta}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: { flex: 1 },
  conteiner: { flex: 1, justifyContent: "center", padding: 24, gap: 24 },
  progresso: { fontSize: 14, textAlign: "center" },
  resultado: { gap: 16 },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  textoResultado: {
    fontSize: 16,
    textAlign: "center",
  },
  botaoSecundario: {
    backgroundColor: "#5B5FEF",
    borderRadius: 30,
    width: "100%",
    height: 48,
  },
});
