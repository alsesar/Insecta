import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Perfil() {
  const params = useLocalSearchParams();
  const [apel, setApel] = useState<string>("");

  useEffect(() => {
    const paramApelido = (params as any).apelido;
    if (paramApelido) {
      const apelidoString = String(paramApelido);
      setApel(apelidoString);
      AsyncStorage.setItem("apelido", apelidoString).catch(() => {});
      return;
    }
    AsyncStorage.getItem("apelido")
      .then((apelidoSalvo) => {
        if (apelidoSalvo) setApel(apelidoSalvo);
      })
      .catch(() => {});
  }, [params]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#101016" }}>
      <ScrollView
        style={{ backgroundColor: "#101016" }}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#101016",
         }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.profile}>
            <Text style={styles.title}>Olá {apel}</Text>
            <Image
              source={require("../assets/profile.jpeg")}
              style={styles.foto}
            />
            <View style={styles.conq}>
              <Text style={styles.subtitle}>Conquistas:</Text>
              <Image
                source={require("../assets/Trofeu.png")}
                style={styles.conqf}
              />
            </View>
          </View>
          <View style={styles.friends}>
            <Text style={styles.subtitleF}>Seus Amigos:</Text>
            <Image
              source={require("../assets/friend.jpeg")}
              style={styles.friendsF1}
            />
            <Image
              source={require("../assets/friend.jpeg")}
              style={styles.friendsF2}
            />
            <Image
              source={require("../assets/friend.jpeg")}
              style={styles.friendsF3}
            />
          </View>

          <View style={styles.downBar}></View>

          <Link href="/social" style={styles.socialL}>
            <Image
              source={require("../assets/users-alt (4).png")}
              style={styles.social}
            />
          </Link>
          <Link href="/main" style={styles.homeL}>
            <Image
              source={require("../assets/home (2).png")}
              style={styles.home}
            />
          </Link>
          <Link href="/user" style={styles.userL}>
            <Image
              source={require("../assets/user (3).png")}
              style={styles.user}
            />
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#101016",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  upBar: {
    backgroundColor: "black",
    padding: 70,
    borderRadius: 10,
    position: "absolute",
    marginBottom: 800,
    width: 500,
  },

  profile: {
    backgroundColor: "#1B1B1B",
    padding: 150,
    borderRadius: 20,
    position: "absolute",
    height: 400,
    marginBottom: 250,
  },

  conq: {
    backgroundColor: "black",
    padding: 30,
    borderRadius: 20,
    position: "absolute",
    marginTop: 260,
    height: 100,
    width: 270,
    marginLeft: 15,
  },

  conqf: {
    borderRadius: 20,
    position: "absolute",
    marginTop: 10,
    height: 100,
    width: 100,
    marginLeft: 90,
  },

  friends: {
    backgroundColor: "#1B1B1B",
    padding: 100,
    borderRadius: 20,
    position: "absolute",
    marginTop: 400,
    width: "100%",
  },

  foto: {
    position: "absolute",
    borderRadius: 200,
    height: 150,
    width: 150,
    marginLeft: 80,
    marginTop: 70,
  },

  friendsF1: {
    position: "absolute",
    borderRadius: 200,
    height: 100,
    width: 100,
    marginLeft: 120,
    marginTop: 70,
  },

  friendsF2: {
    position: "absolute",
    borderRadius: 200,
    height: 100,
    width: 100,
    marginLeft: 230,
    marginTop: 70,
  },

  friendsF3: {
    position: "absolute",
    borderRadius: 200,
    height: 100,
    width: 100,
    marginLeft: 10,
    marginTop: 70,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    position: "absolute",
    alignSelf: "center",
    paddingTop: 20,
  },

  subtitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    marginTop: 10,
    marginLeft: 20,
  },

  subtitleF: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    marginTop: 10,
    marginLeft: 20,
  },

  config: {
    width: 80,
    height: 80,
  },

  configL: {
    position: "absolute",
    marginBottom: 730,
  },

  social: {
    width: 35,
    height: 35,
  },

  socialL: {
    position: "absolute",
    marginRight: 200,
    marginTop: 705,
  },

  home: {
    width: 30,
    height: 30,
  },

  homeL: {
    position: "absolute",
    marginTop: 705,
  },

  user: {
    width: 30,
    height: 30,
  },

  userL: {
    position: "absolute",
    marginLeft: 200,
    marginTop: 705,
  },

  downBar: {
    backgroundColor: "#07070A",
    padding: 30,
    borderRadius: 30,
    marginTop: 700,
    width: 350,
    position: "absolute",
  },
});
