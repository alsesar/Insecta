// TELA DE ATIVIDADE (perguntas de múltipla escolha)
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Botao } from "@/componentes/botao";
import { MultiplaEscolha } from "@/componentes/multipla-escolha";
import { useTema } from "@/contextos/tema";
import { atualizarPerfil } from "@/servicos/servico-api";
import { aviso } from "@/utilitarios/aviso";
import {
    perguntasAvancado,
    perguntasIntermediario,
} from "@/dados/perguntas";

// nota de porcentagem mínima pra ser aprovado
const NOTA_MINIMA = 60;

export default function Atividade() {
  const { cores } = useTema();
  const { nivelPretendido } = useLocalSearchParams<{
    nivelPretendido: "intermediario" | "avancado";
  }>();

  const perguntas =
    nivelPretendido === "avancado" ? perguntasAvancado : perguntasIntermediario;

  const [indiceAtual, setIndiceAtual] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [resultado, setResultado] = useState<null | "passou" | "reprovou">(
    null,
  );

  const perguntaAtual = perguntas[indiceAtual];
  const ultimaPergunta = indiceAtual === perguntas.length - 1;

  const responder = async (indiceEscolhido: number) => {
    const acertou = indiceEscolhido === perguntaAtual.respostaCorreta;
    const novosAcertos = acertou ? acertos + 1 : acertos;

    if (ultimaPergunta) {
      const percentual = (novosAcertos / perguntas.length) * 100;
      const passou = percentual >= NOTA_MINIMA;

      if (passou) {
        // mostra mensagem de parabéns nesta mesma página
        setResultado("passou");
        return;
      }

      // Quando a nota mínima não é atingida, mostra a tela final da atividade.
      const nivelAlcancado =
        nivelPretendido === "avancado" ? "intermediario" : "iniciante";
      try {
        await atualizarPerfil({ nivel: nivelAlcancado });
      } catch (erro) {
        aviso(
          "Erro",
          erro instanceof Error ? erro.message : "Não foi possível salvar o nível.",
        );
        return;
      }
      router.replace({
        pathname: "/nivel-confirmar",
        params: { nivel: nivelAlcancado, nivelPretendido },
      });
      return;
    }

    setAcertos(novosAcertos);
    setIndiceAtual(indiceAtual + 1);
  };
  // componentes da tela
  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <View style={estilos.conteiner}>
        {resultado === "passou" ? (
          <View style={{ gap: 12 }}>
            <Text
              style={{
                color: cores.destaque,
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Parabéns você foi aprovado!
            </Text>
            <Text style={{ color: cores.textoSecundario, textAlign: "center" }}>
              Toque abaixo para ir para seu perfil.
            </Text>
            <View style={{ marginTop: 8 }}>
              <Botao
                rotulo="Ir para meu perfil"
                onPress={async () => {
                  try {
                    await atualizarPerfil({ nivel: nivelPretendido });
                    router.replace("/(tabs)");
                  } catch (erro) {
                    aviso(
                      "Erro",
                      erro instanceof Error
                        ? erro.message
                        : "Não foi possível salvar o nível.",
                    );
                  }
                }}
              />
            </View>
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
// css da tela
const estilos = StyleSheet.create({
  areaSegura: { flex: 1, backgroundColor: "#ffffff" },
  conteiner: { flex: 1, justifyContent: "center", padding: 24, gap: 24 },
  progresso: { color: "#A0A0A8", fontSize: 14, textAlign: "center" },
});
