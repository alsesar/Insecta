// Botão reutilizável que aplica o tema padrão e aceita eventos e estilos nativos.
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { useTema } from "@/contextos/tema";

type PropriedadesBotao = TouchableOpacityProps & {
  rotulo: string;
};

export function Botao({
  rotulo,
  style,
  ...demaisPropriedades
}: PropriedadesBotao) {
  const { cores } = useTema();

  return (
    <TouchableOpacity
      style={[estilos.conteiner, { backgroundColor: cores.destaque }, style]}
      activeOpacity={0.7}
      {...demaisPropriedades}
    >
      <Text style={[estilos.rotulo, { color: cores.textoBotao }]}>{rotulo}</Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    width: "100%",
    height: 48,
    borderRadius: 30,
  },

  rotulo: {
    fontSize: 16,
    fontFamily: "Baloo2_700Bold",
    fontWeight: 600,
    textAlign: "center",
    gap: "12",
    marginTop: 13,
  },
});
