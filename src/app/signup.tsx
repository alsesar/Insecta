import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
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

import { Button } from "@/components/button";
import { Input } from "@/components/input";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarsenha, setConfirmarsenha] = useState("");
  const [mostrar, setMostrar] = useState(false);

  const cadastrar = () => {
    if (!email.trim() || !senha.trim()) {
      return Alert.alert("Entrar", "Preencha todo os campos para se cadastrar");
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      alert("Use um email válido");
      return;
    }
    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!regexSenha.test(senha)) {
      alert(
        "A senha precisa ter 8 caracteres, letras maiúsculas e minúsculas, números e caracteres especiais",
      );

      return;
    }

    if (senha !== confirmarsenha) {
      alert("As senhas não coincidem");
      return;
    }

    const dados = {
      nome,
      email,
      senha,
    };
    const json = JSON.stringify(dados);
    console.log(json);

    alert("Cadastro realizado com sucesso");
    router.replace("/");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#101016" }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#101016" }}
        behavior={Platform.select({ ios: "padding", android: "height" })}
      >
        <ScrollView
          style={{ backgroundColor: "#101016" }}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: "#101016",
            paddingBottom: 100,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View>
              <Image
                source={require("../assets/logo voando.png")}
                style={styles.image}
              />
              <Text style={styles.title}>Cadastre-se!</Text>
              <Text style={styles.subtitle}>
                Crie uma conta para começar a aprender!
              </Text>

              <View style={styles.form}>
                <Text style={styles.suptext}>Nome:</Text>
                <Input placeholder=" " value={nome} onChangeText={setNome} />

                <Text style={styles.suptext}>Email:</Text>
                <Input
                  placeholder=" "
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />

                <Text style={styles.suptext}>Senha:</Text>
                <Input
                  placeholder=" "
                  secureTextEntry={!mostrar}
                  value={senha}
                  onChangeText={setSenha}
                />

                <TouchableOpacity
                  onPress={() => setMostrar(!mostrar)}
                  style={{
                    position: "absolute",
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    transform: [{ translateY: 219 }, { translateX: 300 }],
                  }}
                >
                  <Image
                    source={
                      mostrar
                        ? require("../assets/eye.png")
                        : require("../assets/show.png")
                    }
                    style={styles.eye}
                  />
                </TouchableOpacity>

                <Text style={styles.suptext}>Confrimar senha:</Text>
                <Input
                  placeholder=" "
                  secureTextEntry={!mostrar}
                  value={confirmarsenha}
                  onChangeText={setConfirmarsenha}
                />

                <TouchableOpacity
                  onPress={() => setMostrar(!mostrar)}
                  style={{
                    position: "absolute",
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    transform: [{ translateY: 309 }, { translateX: 300 }],
                  }}
                >
                  <Image
                    source={
                      mostrar
                        ? require("../assets/eye.png")
                        : require("../assets/show.png")
                    }
                    style={styles.eye}
                  />
                </TouchableOpacity>

                <Button label="Cadastrar" onPress={cadastrar} />
              </View>

              <Text style={styles.footerText}>
                Já tem uma conta?{" "}
                <Link href="/" style={styles.footerLink}>
                  Clique aqui!
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#101016",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 100,
    height: 100,
    position: "absolute",
    top: 45,
    marginLeft: 250,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  suptext: {
    color: "#fff",
  },

  form: {
    marginTop: 24,
    gap: 12,
  },

  eye: {
    width: 30,
    height: 30,
    position: "absolute",
  },

  footerText: {
    textAlign: "center",
    color: "#fff",
  },

  footerLink: {
    textAlign: "center",
    color: "#FFC43F",
    fontWeight: 700,
  },
});
