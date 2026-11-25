//TELA DE ESCOLHA DE NÍVEL (a tela onde o usuário escolhe seu nível de conhecimento)
import { useTema } from "@/contextos/tema";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Botao } from "@/componentes/botao";
// importa funções do banco de dados
type NivelOpcao = "iniciante" | "intermediario" | "avancado";
// lista de opções de nível, com chave, rotulo e ícone
const opcoes: { chave: NivelOpcao; rotulo: string; icone: any }[] = [
  {
    chave: "iniciante",
    rotulo: "Iniciante",
    icone: require("../assets/Icons/iniciante.png"),
  },
  {
    chave: "intermediario",
    rotulo: "Intermediário",
    icone: require("../assets/Icons/intermediario.png"),
  },
  {
    chave: "avancado",
    rotulo: "Avançado",
    icone: require("../assets/Icons/avancado.png"),
  },
];

export default function Nivel() {
  const { cores } = useTema();
  const [selecionado, setSelecionado] = useState<NivelOpcao | null>(null);

  const avancar = () => {
    if (!selecionado) return; // não deixa avançar sem escolher

    router.push({
      pathname: "/nivel-confirmar",
      params: { nivel: selecionado },
    });
  };
  // componentes da tela
  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <View style={estilos.conteiner}>
        {opcoes.map((opcao) => (
          <TouchableOpacity
            key={opcao.chave}
            style={[
              estilos.opcao,
              {
                backgroundColor: cores.superficieSuave,
                borderColor:
                  selecionado === opcao.chave ? cores.destaque : cores.borda,
              },
              selecionado === opcao.chave && estilos.opcaoSelecionada,
            ]}
            onPress={() => setSelecionado(opcao.chave)}
          >
            <Image source={opcao.icone} style={estilos.icone} />
            <Text style={[estilos.rotulo, { color: cores.destaque }]}>
              {opcao.rotulo}
            </Text>
          </TouchableOpacity>
        ))}

        <Botao rotulo="Avançar" onPress={avancar} />
      </View>
    </SafeAreaView>
  );
}
// css da tela
const estilos = StyleSheet.create({
  areaSegura: { flex: 1 },
  conteiner: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  opcao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    borderRadius: 100,
    borderWidth: 1,
  },
  opcaoSelecionada: {
    borderWidth: 2,
  },
  icone: { width: 50, height: 50 },
  rotulo: {
    fontSize: 16,
    fontFamily: "Baloo2_700Bold",
  },
});
