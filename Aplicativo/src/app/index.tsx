// Mostra a abertura por alguns segundos e encaminha para a introdução do app.
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";

export default function TelaAbertura() {
  // deixa a tela inicial por 2 segundos antes de mandar o usuário para a intro
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/intro");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  // componentes da tela
  return (
    <LinearGradient colors={["#000166", "#0002CC"]} style={estilos.conteiner}>
      <Text style={estilos.titulo}>Insecta</Text>
    </LinearGradient>
  );
}
// css da tela
const estilos = StyleSheet.create({
  conteiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    color: "#fff",
    fontSize: 42,
    fontFamily: "PixelifySans_400Regular",
    letterSpacing: 2,
  },
});
