// Campo reutilizável que aplica as cores do tema e mantém as propriedades nativas.
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { useTema } from "@/contextos/tema";

export function CampoEntrada({
  style,
  ...demaisPropriedades
}: TextInputProps) {
  const { cores } = useTema();
  return (
    <TextInput
      style={[
        estilos.entrada,
        {
          backgroundColor: cores.superficie,
          borderColor: cores.borda,
          color: cores.texto,
        },
        style,
      ]}
      {...demaisPropriedades}
    />
  );
}

const estilos = StyleSheet.create({
  entrada: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderRadius: 30,
    fontSize: 16,
    paddingLeft: 12,
  },
});
