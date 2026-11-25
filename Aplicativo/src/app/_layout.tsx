// Carrega as fontes e disponibiliza tema e navegação para todas as telas.
import { ProvedorDeTema } from "@/contextos/tema";
import { Baloo2_400Regular, Baloo2_700Bold } from "@expo-google-fonts/baloo-2";
import {
    PixelifySans_400Regular,
    useFonts,
} from "@expo-google-fonts/pixelify-sans";
import { Stack } from "expo-router";

export default function LayoutPrincipal() {
  const [fontsLoaded] = useFonts({
    PixelifySans_400Regular,
    Baloo2_400Regular,
    Baloo2_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ProvedorDeTema>
      <Stack screenOptions={{ headerShown: false }} />
    </ProvedorDeTema>
  );
}
