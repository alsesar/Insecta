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

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrar, setMostrar] = useState(false);

  const entrar = () => {
    if (!email.trim() || !senha.trim()) {
      return Alert.alert("Entrar", "Preencha email e senha para entrar");
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      Alert.alert("Email", "Use um email válido");
      return;
    }

    const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!regexSenha.test(senha)) {
      Alert.alert(
        "Senha",
        "A senha precisa ter 8 caracteres, letras maiúsculas e minúsculas, números e caracteres especiais",
      );

      return;
    }

    const dados = {
      email,
      senha,
    };
    const json = JSON.stringify(dados);
    console.log(json);

    router.push("/apelido");
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
            <Image
              source={require("../assets/logonaope.png")}
              style={styles.image}
            />
            <View style={styles.login}>
              <Text style={styles.title}>Olá!</Text>
              <Text style={styles.subtitle}>
                Bem vindo ao insecta! Seu novo app para aprender
              </Text>
              <View style={styles.form}>
                <Text style={styles.suptext}>Email:</Text>
                <Input
                  placeholder=" "
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  value={email}
                />

                <Text style={styles.suptext}>Senha:</Text>
                <Input
                  placeholder=" "
                  secureTextEntry={!mostrar}
                  onChangeText={setSenha}
                  value={senha}
                />

                <TouchableOpacity
                  onPress={() => setMostrar(!mostrar)}
                  style={{
                    position: "absolute",
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    transform: [{ translateY: 125 }, { translateX: 300 }],
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

                <Text style={styles.footerText}>
                  Esquceu a senha? Clique aqui!
                </Text>
                <Button label="Entrar" onPress={entrar} />
              </View>

              <Text style={styles.footerText}>
                Não tem uma conta?{" "}
                <Link href="/signup" style={styles.footerLink}>
                  Crie aqui!
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
  },

  login: {
    justifyContent: "center",
    borderRadius: 40,
    padding: 20,
    paddingTop: 100,
  },

  image: {
    width: 130,
    height: 130,
    justifyContent: "center",
    transform: [{ translateY: 275 }, { translateX: 270 }],
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

  footerText: {
    color: "#fff",
    marginLeft: 5,
  },

  footerLink: {
    color: "#FFC43F",
    fontWeight: 700,
  },

  eye: {
    width: 22,
    height: 22,
    position: "absolute",
  },
});
