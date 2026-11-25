// TELA DE PERGUNTA DE MÚLTIPLA ESCOLHA (a tela onde o usuário responde a pergunta de múltipla escolha)
import { Botao } from "@/componentes/botao";
import type { Pergunta } from "@/dados/perguntas";
import { useTema } from "@/contextos/tema";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type PropriedadesMultiplaEscolha = {
  pergunta: Pergunta;
  onResponder: (indiceEscolhido: number) => void; // chamado quando o usuário confirma a resposta (próxima)
  ultimaDaLista?: boolean;
};

export function MultiplaEscolha({
  pergunta,
  onResponder,
  ultimaDaLista,
}: PropriedadesMultiplaEscolha) {
  const { cores, escuro } = useTema();
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const [respondido, setRespondido] = useState(false);

  useEffect(() => {
    // quando a pergunta muda, resetamos o estado para esconder o botão
    // e remover as marcações (isso evita que a seleção da pergunta
    // anterior persista na próxima pergunta)
    setSelecionado(null);
    setRespondido(false);
  }, [pergunta.id]);

  const tratarEscolha = (indice: number) => {
    if (respondido) return; // não permitir mudar depois de respondido
    setSelecionado(indice);
    setRespondido(true);
  };

  const confirmar = () => {
    if (selecionado === null) return;
    onResponder(selecionado);
  };

  return (
    <View style={estilos.conteiner}>
      <Text style={[estilos.enunciado, { color: cores.destaque }]}>
        {pergunta.enunciado}
      </Text>

      {pergunta.alternativas.map((alternativa, indice) => {
        const marcado = respondido && selecionado === indice;
        const acertou = marcado && selecionado === pergunta.respostaCorreta;

        const estiloDoConteinerDinamico = {
          backgroundColor: marcado
            ? acertou
              ? "#E6F9EA"
              : "#FFECEC"
            : cores.superficieSuave,
          borderColor: marcado
            ? acertou
              ? "#008000"
              : "#FF0000"
            : "transparent",
          borderWidth: marcado ? 2 : 0,
        } as const;

        const estiloTexto = {
          color: marcado
            ? acertou
              ? escuro
                ? "#85D99A"
                : "#006400"
              : escuro
                ? "#FF9292"
                : "#CC0000"
            : cores.destaque,
        } as const;

        return (
          <TouchableOpacity
            key={indice}
            style={[estilos.alternativa, estiloDoConteinerDinamico]}
            onPress={() => tratarEscolha(indice)}
            activeOpacity={0.8}
            disabled={respondido}
          >
            <Text style={[estilos.textoAlternativa, estiloTexto]}>
              {alternativa}
            </Text>
          </TouchableOpacity>
        );
      })}

      {respondido && (
        <View style={{ marginTop: 8 }}>
          <Botao
            rotulo={ultimaDaLista ? "Finalizar" : "Próxima"}
            onPress={confirmar}
          />
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  conteiner: { gap: 12 },
  enunciado: {
    color: "#2400FF",
    fontSize: 18,
    fontFamily: "Baloo2_700Bold",
    marginBottom: 8,
  },
  alternativa: {
    backgroundColor: "#F2F2F2",
    borderRadius: 16,
    padding: 16,
  },
  textoAlternativa: {
    color: "#2400FF",
    fontSize: 15,
    fontFamily: "Baloo2_400Regular",
  },
});
