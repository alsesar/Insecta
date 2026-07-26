import { Link } from "expo-router";
import { Alert, Image, StyleSheet, View } from "react-native";

export default function Social() {
  const Iniciar = () => {
    Alert.alert(":(", "Não temos níveis disponíveis!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.upBar}></View>

      <View style={styles.downBar}></View>
      <Link href="/social" style={styles.socialL}>
        <Image
          source={require("../assets/users-alt (3).png")}
          style={styles.social}
        />
      </Link>
      <Link href="/main" style={styles.homeL}>
        <Image source={require("../assets/home (2).png")} style={styles.home} />
      </Link>
      <Link href="/user" style={styles.userL}>
        <Image source={require("../assets/user (2).png")} style={styles.user} />
      </Link>
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
