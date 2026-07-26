import { Link } from "expo-router";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/button";

export default function Home() {
  const Iniciar = () => {
    Alert.alert(":(", "Não temos níveis disponíveis!");
  };
  function Social() {
    Alert.alert(":(", "Página indisponível no momento");
  }

  return (
    <View style={styles.container}>
      <View style={styles.upBar}></View>
      <Link href="/config" style={styles.configL}>
        <Image
          source={require("../assets/logolinhayellow.png")}
          style={styles.config}
        />
      </Link>

      <View style={styles.card}>
        <View style={styles.topCard}>
          <Image
            source={require("../assets/patchdourado1.png")}
            style={styles.coin}
          />
          <Text style={styles.title}>Exercício 1</Text>
        </View>
        <View style={styles.miniCard}>
          <Image
            source={require("../assets/logoempemaobixapiscada.png")}
            style={styles.joana}
          />
        </View>
      </View>

      <View style={styles.downBar}></View>

      <Link href="/social" style={styles.socialL}>
        <Image
          source={require("../assets/users-alt (4).png")}
          style={styles.social}
        />
      </Link>
      <Link href="/main" style={styles.homeL}>
        <Image source={require("../assets/home (3).png")} style={styles.home} />
      </Link>
      <Link href="/user" style={styles.userL}>
        <Image source={require("../assets/user (2).png")} style={styles.user} />
      </Link>

      <Button style={styles.start} onPress={Iniciar} label="Iniciar" />
    </View>
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

  card: {
    backgroundColor: "#1B1B1B",
    padding: 150,
    borderRadius: 20,
    position: "absolute",
    height: 400,
    marginBottom: 150,
  },

  miniCard: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 20,
    position: "absolute",
    height: 250,
    marginTop: 150,
    width: 300,
    borderWidth: 2,
    borderColor: "#FFC43F",
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    position: "absolute",
    marginLeft: 80,
    marginTop: 30,
  },

  topCard: {
    backgroundColor: "black",
    padding: 1,
    borderRadius: 20,
    position: "absolute",
    width: 300,
    marginBottom: 150,
    height: 100,
  },

  coin: {
    width: 100,
    height: 100,
    position: "absolute",
  },

  joana: {
    width: 200,
    height: 200,
    marginLeft: 45,
  },

  start: {
    backgroundColor: "#FFC43F",
    marginTop: 320,
    width: 300,
    height: 48,
    borderRadius: 8,
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
