// Exibe o nível e a barra que representa o progresso das atividades.
import { useTema } from "@/contextos/tema";
import {
    calcularProgressoGeral,
} from "@/utilitarios/progresso";
import { carregarProgressoAtividades } from "@/servicos/servico-api";
import { aviso } from "@/utilitarios/aviso";
import { useFocusEffect } from "expo-router";
import { useCallback, useState, type ReactNode } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type CabecalhoProgressoProps = {
  progresso?: number;
  nivel?: string | null;
  acaoDireita?: ReactNode;
};

const iconesPorNivel: Record<string, number> = {
  iniciante: require("../assets/Icons/iniciante.png"),
  intermediario: require("../assets/Icons/intermediario.png"),
  avancado: require("../assets/Icons/avancado.png"),
};

const nomesPorNivel: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export function CabecalhoProgresso({
  progresso,
  nivel,
  acaoDireita,
}: CabecalhoProgressoProps) {
  const { cores } = useTema();
  const [progressoCarregado, setProgressoCarregado] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (progresso !== undefined) return;
      let ativo = true;
      carregarProgressoAtividades()
        .then((dados) => {
          if (ativo) setProgressoCarregado(calcularProgressoGeral(dados));
        })
        .catch(() => {
          if (ativo) aviso("Erro", "Não foi possível carregar o progresso.");
        });
      return () => {
        ativo = false;
      };
    }, [progresso]),
  );

  const nivelNormalizado = nivel?.toLowerCase() ?? "";

  return (
    <View style={estilos.cabecalho}>
      <Image
        source={iconesPorNivel[nivelNormalizado] ?? iconesPorNivel.iniciante}
        style={estilos.iconeEsquerda}
      />

      {nomesPorNivel[nivelNormalizado] ? (
        <Text
          numberOfLines={1}
          style={[estilos.nivel, { color: cores.textoSecundario }]}
        >
          {nomesPorNivel[nivelNormalizado]}
        </Text>
      ) : null}

      <View
        style={[estilos.trilho, { backgroundColor: cores.trilho }]}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.round((progresso ?? progressoCarregado) * 100),
        }}
      >
        <View
          style={[
            estilos.preenchimento,
            {
              width: `${(progresso ?? progressoCarregado) * 100}%`,
              backgroundColor: cores.destaque,
            },
          ]}
        />
      </View>

      {acaoDireita}
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  iconeEsquerda: {
    width: 42,
    height: 42,
  },
  trilho: {
    flex: 1,
    height: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  preenchimento: {
    height: "100%",
    borderRadius: 8,
  },
  nivel: { maxWidth: 80, fontSize: 12, fontWeight: "700" },
});
