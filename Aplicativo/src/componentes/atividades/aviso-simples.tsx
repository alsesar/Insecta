import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Este aviso reutilizável recebe um título, uma mensagem
// e a ação de fechar para poder ser usado em diferentes pontos do app sem duplicar layout.
type PropriedadesAvisoSimples = {
  titulo: string;
  mensagem: string;
  aoFechar: () => void;
};

export function AvisoSimples({
  titulo,
  mensagem,
  aoFechar,
}: PropriedadesAvisoSimples) {
  return (
    <View>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.mensagem}>{mensagem}</Text>
      <TouchableOpacity style={estilos.botao} onPress={aoFechar}>
        <Text style={estilos.textoBotao}>Ok</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  titulo: {
    color: "#FFC43F",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  mensagem: { color: "#fff", fontSize: 16, marginBottom: 20 },
  botao: {
    backgroundColor: "#FFC43F",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  textoBotao: { color: "#101016", fontWeight: "600" },
});
