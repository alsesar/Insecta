// Organiza as telas principais nas abas e aplica as cores do tema atual.
import { useTema } from "@/contextos/tema";
import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function LayoutAbas() {
  const { cores } = useTema();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: {
          position: "absolute",
          bottom: 24,
          marginHorizontal: 20,
          height: 45,
          borderRadius: 24,
          backgroundColor: cores.superficieSuave,
          opacity: 0.9,
        },
        tabBarItemStyle: {
          paddingTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="social"
        options={{
          title: " ",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/Icons/users-alt(2).png")
                  : require("../../assets/Icons/users-alt.png")
              }
              style={{ width: 35, height: 35 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: " ",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/Icons/home(1).png")
                  : require("../../assets/Icons/home.png")
              }
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../../assets/Icons/user(1).png")
                  : require("../../assets/Icons/user 1.png")
              }
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
