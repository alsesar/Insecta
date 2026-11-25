// Apresenta uma janela modal com tema, conteúdo e fechamento controlado pela tela.
import type { ReactNode } from "react";
import { useTema } from "@/contextos/tema";
import { Modal, StyleSheet, View } from "react-native";

// esta type define a estrutura mínima que o modal precisa receber: visibilidade,
// callback de fechamento e o conteúdo dinâmico que será renderizado dentro dele
// children é o tipo especial que aceita qualquer JSX, como texto, botões e componentes
type PropriedadesDaJanelaModal = {
  visivel: boolean;
  aoFechar: () => void;
  children: ReactNode;
};

export function JanelaModal({
  visivel,
  aoFechar,
  children,
}: PropriedadesDaJanelaModal) {
  const { cores } = useTema();

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={aoFechar}
    >
      <View style={estilos.sobreposicao}>
        <View style={[estilos.cartao, { backgroundColor: cores.superficie }]}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  sobreposicao: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  cartao: {
    borderRadius: 20,
    padding: 24,
    width: "85%",
  },
});
