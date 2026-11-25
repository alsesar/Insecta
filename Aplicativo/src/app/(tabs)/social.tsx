// Carrega o ranking do servidor e permite incluir amizades pelo apelido.
import { Botao } from "@/componentes/botao";
import { CabecalhoProgresso } from "@/componentes/cabecalho-progresso";
import { CampoEntrada } from "@/componentes/campo-entrada";
import { useTema } from "@/contextos/tema";
import {
  adicionarAmigoPorApelido,
  carregarRankingSocial,
  type AmigoDoRanking,
} from "@/servicos/servico-api";
import { aviso } from "@/utilitarios/aviso";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ALTURA_MAXIMA = 190;

export default function Social() {
  const { cores } = useTema();
  const [apelidoAmigo, setApelidoAmigo] = useState("");
  const [ranking, setRanking] = useState<AmigoDoRanking[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [adicionando, setAdicionando] = useState(false);

  const atualizarRanking = useCallback(async () => {
    try {
      setRanking(await carregarRankingSocial());
    } catch {
      aviso("Erro", "Não foi possível carregar o ranking social.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregando(true);
      carregarRankingSocial()
        .then((dados) => {
          if (ativo) setRanking(dados);
        })
        .catch(() => {
          if (ativo)
            aviso("Erro", "Não foi possível carregar o ranking social.");
        })
        .finally(() => {
          if (ativo) setCarregando(false);
        });
      return () => {
        ativo = false;
      };
    }, []),
  );

  async function adicionarAmigo() {
    if (adicionando) return;
    setAdicionando(true);
    try {
      await adicionarAmigoPorApelido(apelidoAmigo);
      setApelidoAmigo("");
      await atualizarRanking();
      aviso("Amigo adicionado", "A pessoa já aparece no seu ranking.");
    } catch (erro) {
      aviso(
        "Não foi possível adicionar",
        erro instanceof Error ? erro.message : "Tente novamente.",
      );
    } finally {
      setAdicionando(false);
    }
  }

  const amigos = ranking.filter((pessoa) => !pessoa.usuarioAtual);
  const usuarioAtual = ranking.find((pessoa) => pessoa.usuarioAtual);
  const maiorValor = Math.max(
    1,
    ...ranking.map((pessoa) => pessoa.atividadesConcluidas),
  );

  function situacao(pessoa: AmigoDoRanking) {
    if (pessoa.usuarioAtual) return "Você";
    if (!usuarioAtual) return "Amigo";
    if (pessoa.atividadesConcluidas > usuarioAtual.atividadesConcluidas) {
      return "À sua frente";
    }
    if (pessoa.atividadesConcluidas === usuarioAtual.atividadesConcluidas) {
      return "Empatado";
    }
    return "Atrás de você";
  }

  return (
    <SafeAreaView
      style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}
      edges={["top"]}
    >
      <CabecalhoProgresso />
      <KeyboardAvoidingView
        style={estilos.flex}
        behavior={Platform.select({ ios: "padding", android: "height" })}
      >
        <ScrollView
          contentContainerStyle={estilos.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[estilos.titulo, { color: cores.texto }]}>Social</Text>
          <Text style={[estilos.subtitulo, { color: cores.textoSecundario }]}>
            Compare atividades concluídas com seus amigos.
          </Text>

          {amigos.length === 0 && !carregando ? (
            <View
              style={[
                estilos.estadoVazio,
                { backgroundColor: cores.superficieSuave },
              ]}
            >
              <Text style={[estilos.estadoTitulo, { color: cores.texto }]}>
                Seu ranking começa com um amigo
              </Text>
              <Text
                style={[estilos.estadoTexto, { color: cores.textoSecundario }]}
              >
                Adicione alguém pelo apelido para comparar o progresso em
                atividades.
              </Text>
            </View>
          ) : null}

          <View style={estilos.formulario}>
            <Text style={[estilos.rotulo, { color: cores.texto }]}>
              Adicionar por apelido
            </Text>
            <CampoEntrada
              value={apelidoAmigo}
              onChangeText={setApelidoAmigo}
              placeholder="Apelido da pessoa"
              placeholderTextColor={cores.textoSecundario}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={40}
              returnKeyType="done"
              onSubmitEditing={adicionarAmigo}
            />
            <Botao
              rotulo={adicionando ? "Adicionando..." : "Adicionar amigo"}
              onPress={adicionarAmigo}
              disabled={adicionando || !apelidoAmigo.trim()}
              style={amigos.length === 0 ? estilos.botaoEmDestaque : undefined}
            />
          </View>

          {amigos.length > 0 ? (
            <View style={estilos.secaoGrafico}>
              <View style={estilos.cabecalhoGrafico}>
                <Text style={[estilos.tituloGrafico, { color: cores.texto }]}>
                  Atividades concluídas
                </Text>
                {usuarioAtual ? (
                  <Text style={{ color: cores.textoSecundario }}>
                    Você: {usuarioAtual.atividadesConcluidas}
                  </Text>
                ) : null}
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={estilos.grafico}>
                  {ranking.map((pessoa) => {
                    const altura = Math.max(
                      8,
                      (pessoa.atividadesConcluidas / maiorValor) *
                        ALTURA_MAXIMA,
                    );
                    return (
                      <View key={pessoa.id_usuario} style={estilos.coluna}>
                        <Text style={[estilos.contagem, { color: cores.texto }]}>
                          {pessoa.atividadesConcluidas}
                        </Text>
                        <View
                          style={[
                            estilos.barra,
                            {
                              height: altura,
                              backgroundColor: pessoa.usuarioAtual
                                ? cores.destaque
                                : cores.borda,
                            },
                          ]}
                        />
                        <Text
                          numberOfLines={1}
                          style={[
                            estilos.apelido,
                            { color: cores.texto },
                            pessoa.usuarioAtual && estilos.apelidoAtual,
                          ]}
                        >
                          {pessoa.usuarioAtual ? "Você" : pessoa.apelido}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={[
                            estilos.situacao,
                            {
                              color:
                                pessoa.atividadesConcluidas >
                                (usuarioAtual?.atividadesConcluidas ?? 0)
                                  ? cores.destaque
                                  : cores.textoSecundario,
                            },
                          ]}
                        >
                          {situacao(pessoa)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          ) : null}

          {carregando ? (
            <Text style={[estilos.carregando, { color: cores.textoSecundario }]}>
              Carregando ranking...
            </Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 110,
    gap: 16,
  },
  titulo: { fontSize: 25, fontFamily: "Baloo2_700Bold" },
  subtitulo: { fontSize: 15, marginTop: -14 },
  estadoVazio: {
    padding: 16,
    gap: 5,
    borderRadius: 12,
  },
  estadoTitulo: { fontSize: 18, fontFamily: "Baloo2_700Bold" },
  estadoTexto: { fontSize: 14, lineHeight: 20 },
  formulario: { gap: 10, marginTop: 4 },
  rotulo: { fontSize: 15, fontWeight: "700" },
  botaoEmDestaque: {
    height: 54,
  },
  secaoGrafico: { marginTop: 8, gap: 14 },
  cabecalhoGrafico: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  tituloGrafico: { fontSize: 17, fontFamily: "Baloo2_700Bold" },
  grafico: {
    minHeight: 270,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    paddingHorizontal: 4,
    paddingTop: 20,
  },
  coluna: {
    width: 76,
    minHeight: 250,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  contagem: { fontSize: 14, fontWeight: "700" },
  barra: { width: 38, borderTopLeftRadius: 7, borderTopRightRadius: 7 },
  apelido: { maxWidth: 74, fontSize: 12, textAlign: "center" },
  apelidoAtual: { fontWeight: "700" },
  situacao: { maxWidth: 74, fontSize: 10, textAlign: "center" },
  carregando: { textAlign: "center", marginTop: 20 },
});
