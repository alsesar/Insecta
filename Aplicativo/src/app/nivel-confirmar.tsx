//TELA DE CONFIRMAÇÃO DE NÍVEL (a tela que aparece depois da escolha do nível, para confirmar a escolha)
import { useTema } from "@/contextos/tema";
import { atualizarPerfil } from "@/servicos/servico-api";
import { aviso } from "@/utilitarios/aviso";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Botao } from "@/componentes/botao";

// configuração: a "fonte da verdade" de cada nível
const conteudoPorNivel = {
  iniciante: {
    titulo: "Iniciante",
    texto:
      "Tudo bem começar do zero! Aqui você vai aprender o básico de informática com calma, sem pressa e sem cobrança. Cada passo conta, e a gente constrói essa base juntos.",
    icone: require("../assets/Icons/iniciantem.gif"),
  },
  intermediario: {
    titulo: "Intermediário",
    texto:
      "Você já sabe algumas coisas, só que meio espalhadas, né? A gente vai te ajudar a organizar esse conhecimento, preencher as lacunas e deixar tudo mais sólido.",
    icone: require("../assets/Icons/intermediariom.gif"),
  },
  avancado: {
    titulo: "Avançado",
    texto:
      "Você já tem uma boa bagagem em informática, mas será que sabe o suficiente pra qualquer situação? Chegou a hora de testar seus limites e afiar ainda mais suas habilidades.",
    icone: require("../assets/Icons/avancadom.gif"),
  },
};

export default function NivelConfirmar() {
  const { cores } = useTema();
  const { nivel, nivelPretendido } = useLocalSearchParams<{
    nivel: keyof typeof conteudoPorNivel;
    nivelPretendido?: string;
  }>();

  const dados = nivel ? conteudoPorNivel[nivel] : null;

  // Só é "rebaixamento" se veio de uma prova E o resultado foi diferente do pretendido
  const foiRebaixado = nivelPretendido && nivelPretendido !== nivel;

  const avancar = async () => {
    if (!nivel) return;
    try {
      if (nivel === "iniciante") {
        await atualizarPerfil({ nivel });
        router.replace("/(tabs)");
      } else {
        router.push({
          pathname: "/nivel-transicao",
          params: { nivelPretendido: nivel },
        });
      }
    } catch (erro) {
      aviso(
        "Erro",
        erro instanceof Error ? erro.message : "Não foi possível salvar o nível.",
      );
    }
  };

  const tentarNovamente = () => {
    router.push("/nivel");
  };
  // componentes da tela
  if (!dados) {
    return (
      <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
        <View style={estilos.conteiner}>
          <Text style={[estilos.titulo, { color: cores.destaque }]}>
            Nível não encontrado
          </Text>
          <Link href="/nivel" style={{ color: cores.destaque }}>
            Voltar
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <View style={estilos.conteiner}>
        <View style={[estilos.cartao, { backgroundColor: cores.superficieSuave }]}>
          <View style={estilos.cabecalhoCartao}>
            <Image source={dados.icone} style={estilos.icone} />
            <Text style={[estilos.tituloCartao, { color: cores.destaque }]}>
              {dados.titulo}
            </Text>
          </View>
          <Text style={[estilos.texto, { color: cores.texto }]}>
            {dados.texto}
          </Text>
        </View>

        {foiRebaixado && (
          <View style={estilos.cartaoAviso}>
            <Text style={[estilos.textoAviso, { color: cores.texto }]}>
              Você ficou pertinho! Que tal tentar de novo?
            </Text>
          </View>
        )}
        <Botao rotulo="Avançar" onPress={avancar} />

        {foiRebaixado ? (
          <Botao
            rotulo="Tentar novamente"
            onPress={tentarNovamente}
            style={estilos.botaoSecundario}
          />
        ) : (
          <Text style={[estilos.textoRodape, { color: cores.textoSecundario }]}>
            Quer tentar outro nível?{" "}
            <Link
              href="/nivel"
              style={[estilos.atalhoRodape, { color: cores.destaque }]}
            >
              Escolher de novo
            </Link>
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
//css da tela
const estilos = StyleSheet.create({
  areaSegura: { flex: 1, backgroundColor: "#ffffff" },
  conteiner: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  cartao: {
    backgroundColor: "#F2F2F2",
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  cabecalhoCartao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  icone: { width: 75, height: 75 },
  tituloCartao: {
    color: "#2400FF",
    fontSize: 18,
    fontFamily: "Baloo2_700Bold",
  },
  texto: {
    color: "#2400FF",
    fontSize: 20,
    fontFamily: "Baloo2_400Regular",
    opacity: 0.8,
  },
  titulo: {
    color: "#2400FF",
    fontSize: 25,
    fontFamily: "Baloo2_700Bold",
    textAlign: "center",
  },
  textoRodape: {
    color: "#A0A0A8",
    textAlign: "center",
  },
  atalhoRodape: {
    color: "#0002CC",
    fontWeight: "700",
  },

  botaoSecundario: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#0002CC",
  },
  cartaoAviso: {
    backgroundColor: "#FFF4D6",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0DFA0",
  },
  textoAviso: {
    color: "#8A6D00",
    fontSize: 15,
    fontFamily: "Baloo2_700Bold",
    textAlign: "center",
  },
});
