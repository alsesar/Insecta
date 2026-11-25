// Reúne os campos de cadastro e solicita a criação da conta ao servidor.
import { useTema } from "@/contextos/tema";
import { cadastrarUsuario } from "@/servicos/servico-api";
import { aviso } from "@/utilitarios/aviso";
import { senhaValida } from "@/utilitarios/senha";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Botao } from "@/componentes/botao";
import { CampoEntrada } from "@/componentes/campo-entrada";

export default function Cadastro() {
  const { cores } = useTema();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarsenha, setConfirmarsenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  // esse fluxo garante que a conta só seja gravada quando todos os dados estiverem válidos
  const cadastrar = async () => {
    try {
      if (!nome.trim() || !email.trim() || !senha.trim()) {
        return aviso("Cadastro", "Preencha todos os campos para se cadastrar");
      }
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email.trim())) {
        aviso("Email", "Use um email válido");
        return;
      }

      if (!senhaValida(senha)) {
        aviso(
          "Senha",
          "A senha precisa ter 8 caracteres, letras maiúsculas e minúsculas, números e caracteres especiais",
        );
        return;
      }

      if (senha !== confirmarsenha) {
        aviso("Senha", "As senhas não coincidem");
        return;
      }
      await cadastrarUsuario(nome.trim(), email.trim(), senha);

      aviso("Cadastro", "Cadastro realizado com sucesso");
      router.replace("/entrar");
    } catch (erro) {
      aviso(
        "Erro",
        erro instanceof Error ? erro.message : "Não foi possível cadastrar.",
      );
    }
  };
  // componentes da tela
  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: "height" })}
      >
        <ScrollView
          contentContainerStyle={estilos.conteudoRolavel}
          keyboardShouldPersistTaps="handled"
        >
          <View style={estilos.cabecalho}>
            <Text style={[estilos.titulo, { color: cores.destaque }]}>
              Cadastre-se!
            </Text>
          </View>

          <Text style={[estilos.subtitulo, { color: cores.textoSecundario }]}>
            Crie uma conta para começar a aprender!
          </Text>

          <View style={estilos.formulario}>
            <Text style={[estilos.rotulo, { color: cores.textoSecundario }]}>
              Nome:
            </Text>
            <CampoEntrada
              placeholder="Seu nome"
              placeholderTextColor="#B0B0B8"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={[estilos.rotulo, { color: cores.textoSecundario }]}>
              Email:
            </Text>
            <CampoEntrada
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#B0B0B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={[estilos.rotulo, { color: cores.textoSecundario }]}>
              Senha:
            </Text>
            <View style={estilos.entradaComIcone}>
              <CampoEntrada
                placeholder="#Exemplo123"
                placeholderTextColor="#B0B0B8"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity
                onPress={() => setMostrarSenha(!mostrarSenha)}
                style={estilos.botaoVisibilidadeSenha}
              >
                <Image
                  source={
                    mostrarSenha
                      ? require("../assets/Icons/eye.png")
                      : require("../assets/Icons/show.png")
                  }
                  style={estilos.iconeOlho}
                />
              </TouchableOpacity>
            </View>

            <Text style={[estilos.rotulo, { color: cores.textoSecundario }]}>
              Confirmar senha:
            </Text>
            <View style={estilos.entradaComIcone}>
              <CampoEntrada
                placeholder="#Exemplo123"
                placeholderTextColor="#B0B0B8"
                secureTextEntry={!mostrarConfirmar}
                value={confirmarsenha}
                onChangeText={setConfirmarsenha}
              />
              <TouchableOpacity
                onPress={() => setMostrarConfirmar(!mostrarConfirmar)}
                style={estilos.botaoVisibilidadeSenha}
              >
                <Image
                  source={
                    mostrarConfirmar
                      ? require("../assets/Icons/eye.png")
                      : require("../assets/Icons/show.png")
                  }
                  style={estilos.iconeOlho}
                />
              </TouchableOpacity>
            </View>

            <Botao rotulo="Cadastrar" onPress={cadastrar} />
          </View>

          <Text style={[estilos.textoRodape, { color: cores.textoSecundario }]}>
            Já tem uma conta?{" "}
            <Link
              href="/entrar"
              style={[estilos.atalhoRodape, { color: cores.destaque }]}
            >
              Clique aqui!
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
// css da tela
const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
  },

  conteudoRolavel: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  cabecalho: {
    marginBottom: 8,
  },

  titulo: {
    fontSize: 28,
    fontFamily: "Baloo2_700Bold",
    opacity: 0.9,
  },

  subtitulo: {
    fontSize: 20,
    marginBottom: 24,
    fontFamily: "Baloo2_400Regular",
    opacity: 0.6,
  },

  formulario: {
    gap: 12,
  },

  rotulo: {
    fontSize: 14,
    fontFamily: "600",
    opacity: 0.8,
    marginLeft: 9,
  },

  entradaComIcone: {
    flexDirection: "row",
    alignItems: "center",
  },

  entradaInterna: {
    flex: 1,
  },

  botaoVisibilidadeSenha: {
    position: "absolute",
    right: 12,
    padding: 4,
  },

  iconeOlho: {
    width: 20,
    height: 20,
  },

  textoRodape: {
    textAlign: "center",
  },

  atalhoRodape: {
    fontWeight: "700",
  },
});
