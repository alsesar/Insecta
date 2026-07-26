import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { Input } from "@/components/input";

export default function IndexPage() {
  const [id_usuario, setApelido] = useState("");

  async function continuar() {
    try {
      await AsyncStorage.setItem("apelido", id_usuario);
    } catch (erro) {}
    router.push("/user");
  }

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
            <View style={styles.login}>
              <Text style={styles.title}>Como podemos te chamar?</Text>
              <View style={styles.form}>
                <Text style={styles.suptext}>Apelido:</Text>
                <Input
                  placeholder=" "
                  onChangeText={setApelido}
                  autoCapitalize="none"
                  value={id_usuario}
                />
                <Button label="Continuar" onPress={continuar} />
              </View>
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
    paddingTop: 250,
  },

  image: {
    width: 130,
    height: 130,
    justifyContent: "center",
    transform: [{ translateY: 100 }, { translateX: 120 }],
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
    width: 30,
    height: 30,
    position: "absolute",
  },
});
