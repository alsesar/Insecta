import { CabecalhoProgresso } from "@/componentes/cabecalho-progresso";
import { useTema } from "@/contextos/tema";
import {
    carregarPerfilUsuario,
    enviarFotoPerfil,
    urlFotoPerfil,
} from "@/servicos/servico-api";
import { aviso } from "@/utilitarios/aviso";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Exibe os dados do perfil e envia alterações ao servidor.
const FOTO_PADRAO = require("../../assets/Icons/user.png");
const TAMANHO_MAXIMO_FOTO = 5 * 1024 * 1024;

export default function Perfil() {
  const { cores } = useTema();
  const [apelido, setApelido] = useState("Usuário");
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [concluiuPrimeiraAtividade, setConcluiuPrimeiraAtividade] =
    useState(false);
  const [salvandoFoto, setSalvandoFoto] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      carregarPerfilUsuario()
        .then((perfil) => {
          if (!ativo) return;
          setApelido(perfil.usuario.apelido?.trim() || "Usuário");
          setFotoUri(urlFotoPerfil(perfil.usuario.foto_url));
          setConcluiuPrimeiraAtividade(perfil.progresso["1"] === 100);
        })
        .catch(() => {
          if (ativo) aviso("Erro", "Não foi possível carregar o perfil.");
        });

      return () => {
        ativo = false;
      };
    }, []),
  );

  async function escolherFoto() {
    if (salvandoFoto) return;
    setSalvandoFoto(true);
    try {
      if (Platform.OS !== "web") {
        const permissao =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissao.granted) {
          aviso(
            "Permissão necessária",
            "Autorize o acesso às fotos para escolher uma imagem de perfil.",
          );
          return;
        }
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        exif: false,
        allowsMultipleSelection: false,
      });
      if (resultado.canceled) return;

      const imagem = resultado.assets[0];
      if (!imagem || imagem.type !== "image") {
        aviso("Imagem inválida", "Escolha um arquivo de imagem.");
        return;
      }

      const tamanho = imagem.fileSize ?? imagem.file?.size ?? 0;
      const tipo = imagem.mimeType ?? imagem.file?.type ?? "";
      if (
        tamanho <= 0 ||
        tamanho > TAMANHO_MAXIMO_FOTO ||
        !["image/jpeg", "image/png", "image/webp"].includes(tipo)
      ) {
        aviso(
          "Imagem não aceita",
          "Use uma foto JPG, PNG ou WebP de até 5 MB.",
        );
        return;
      }

      const extensao =
        tipo === "image/png" ? "png" : tipo === "image/webp" ? "webp" : "jpg";
      const respostaFoto = await enviarFotoPerfil(
        imagem.uri,
        `perfil.${extensao}`,
        tipo,
      );
      setFotoUri(urlFotoPerfil(respostaFoto.foto_url));
    } catch {
      aviso("Erro", "Não foi possível salvar a foto de perfil.");
    } finally {
      setSalvandoFoto(false);
    }
  }

  return (
    <SafeAreaView
      style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}
      edges={["top"]}
    >
      <CabecalhoProgresso />
      <ScrollView contentContainerStyle={estilos.scroll}>
        <View style={estilos.conteudo}>
          <Text style={[estilos.saudacao, { color: cores.destaque }]}>
            Olá, {apelido}
          </Text>
          <Pressable
            onPress={escolherFoto}
            disabled={salvandoFoto}
            accessibilityRole="button"
            accessibilityLabel="Alterar foto de perfil"
            accessibilityHint="Abre a galeria para escolher uma nova foto"
            style={estilos.controleFoto}
          >
            <Image
              source={fotoUri ? { uri: fotoUri } : FOTO_PADRAO}
              style={estilos.foto}
            />
            <Text style={[estilos.ajudaFoto, { color: cores.textoSecundario }]}>
              {salvandoFoto ? "Salvando foto..." : "Toque na foto para alterar"}
            </Text>
          </Pressable>

          <View
            style={[
              estilos.cardConquistas,
              { backgroundColor: cores.superficieSuave },
            ]}
          >
            <Text style={[estilos.cardTitulo, { color: cores.texto }]}>
              Conquistas
            </Text>
            {concluiuPrimeiraAtividade ? (
              <View style={estilos.conquista}>
                <Image
                  source={require("../../assets/Trofeu.png")}
                  style={estilos.trofeu}
                />
                <View style={estilos.textoConquista}>
                  <Text
                    style={[estilos.conquistaTitulo, { color: cores.texto }]}
                  >
                    Primeira atividade concluída
                  </Text>
                  <Text style={{ color: cores.textoSecundario }}>
                    Você concluiu sua primeira atividade.
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={[estilos.vazio, { color: cores.textoSecundario }]}>
                Conclua sua primeira atividade para ganhar o troféu.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 100 },
  conteudo: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 18,
  },
  saudacao: {
    fontSize: 24,
    fontFamily: "Baloo2_700Bold",
  },
  foto: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#E6E6E8",
  },
  controleFoto: { alignItems: "center", gap: 6 },
  ajudaFoto: { fontSize: 13 },
  cardConquistas: {
    width: "100%",
    minHeight: 150,
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  cardTitulo: {
    fontSize: 20,
    fontFamily: "Baloo2_700Bold",
  },
  vazio: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
  conquista: { flexDirection: "row", alignItems: "center", gap: 14 },
  trofeu: { width: 64, height: 64, resizeMode: "contain" },
  textoConquista: { flex: 1, gap: 4 },
  conquistaTitulo: { fontSize: 16, fontWeight: "700" },
});
