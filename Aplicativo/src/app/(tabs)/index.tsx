// PÁGINA INICIAL DO APP (lista de atividades, progresso e configurações)
import { JanelaModal } from "@/componentes/janela-modal";
import { CabecalhoProgresso } from "@/componentes/cabecalho-progresso";
import { CirculoProgresso } from "@/componentes/circulo-progresso";
import { useTema } from "@/contextos/tema";
import {
  carregarPerfilUsuario,
  carregarProgressoAtividades,
  encerrarSessaoApi,
} from "@/servicos/servico-api";
import { limparSessao } from "@/servicos/sessao";
import {
  atividadeDesbloqueada,
  calcularProgressoGeral,
  type ProgressoAtividades,
} from "@/utilitarios/progresso";
import { aviso } from "@/utilitarios/aviso";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TIPO DA ATIVIDADE (estrutura de cada item da lista)
type Atividade = {
  id: number;
  titulo: string;
  descricao: string;
  cor: string;
};

const atividades: Atividade[] = [
  {
    id: 1,
    titulo: "Atividade 1",
    descricao:
      "Nessa atividade você vai aprender os conceitos básicos de hardware, identificando as principais peças de um computador.",
    cor: "#5B5FEF",
  },
  {
    id: 2,
    titulo: "Atividade 2",
    descricao:
      "Aprenda a proteger seus dados e reconhecer riscos no ambiente digital.",
    cor: "#3730A3",
  },
  {
    id: 3,
    titulo: "Atividade 3",
    descricao:
      "Conheça a internet, os navegadores e como encontrar informações confiáveis.",
    cor: "#5B5FEF",
  },
  {
    id: 4,
    titulo: "Atividade 4",
    descricao:
      "Explore os sistemas operacionais e aprenda a navegar pelo computador.",
    cor: "#3730A3",
  },
  {
    id: 5,
    titulo: "Atividade 5",
    descricao:
      "Organize arquivos e pastas para manter seus documentos fáceis de encontrar.",
    cor: "#5B5FEF",
  },
  {
    id: 6,
    titulo: "Atividade 6",
    descricao:
      "Use ferramentas digitais para se comunicar com clareza e responsabilidade.",
    cor: "#3730A3",
  },
  {
    id: 7,
    titulo: "Atividade 7",
    descricao:
      "Reúna o que aprendeu em um desafio final de informática básica.",
    cor: "#5B5FEF",
  },
];

// PÁGINA INICIAL
export default function PaginaPrincipal() {
  const [selecionada, setSelecionada] = useState<Atividade | null>(null);
  const [configuracoesAberta, setConfiguracoesAberta] = useState(false);
  const [progressoAtividades, setProgressoAtividades] =
    useState<ProgressoAtividades>({});
  const [nivelUsuario, setNivelUsuario] = useState<string | null>(null);
  const { escuro, cores, definirTemaEscuro } = useTema();

  useFocusEffect(
    useCallback(() => {
      let ativa = true;
      Promise.all([carregarProgressoAtividades(), carregarPerfilUsuario()])
        .then(([progresso, perfil]) => {
          if (!ativa) return;
          setProgressoAtividades(progresso);
          setNivelUsuario(perfil.usuario.nivel);
        })
        .catch((erro) => {
          if (!ativa) return;
          aviso(
            "Erro",
            erro instanceof Error
              ? erro.message
              : "Não foi possível carregar seu progresso.",
          );
        });
      return () => {
        ativa = false;
      };
    }, []),
  );

  async function sair() {
    try {
      await encerrarSessaoApi();
    } catch (erro) {
      aviso(
        "Erro",
        erro instanceof Error ? erro.message : "Não foi possível encerrar a sessão.",
      );
      return;
    }
    await limparSessao();
    setConfiguracoesAberta(false);
    router.replace("/entrar");
  }

  const progressoGeral = calcularProgressoGeral(progressoAtividades);

  function abrirDetalhes(atividade: Atividade) {
    if (!atividadeDesbloqueada(atividade.id, progressoAtividades)) return;
    setSelecionada(atividade);
  }

  function iniciarAtividade() {
    if (!selecionada) return;

    const id = selecionada.id;
    setSelecionada(null);
    router.push({ pathname: "/atividade/[id]", params: { id: String(id) } });
  }

  // FUNÇÃO PARA ABRIR O MODAL DE CONFIGURAÇÕES
  function abrirConfiguracoes() {
    setConfiguracoesAberta(true);
  }

  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <CabecalhoProgresso
        progresso={progressoGeral}
        nivel={nivelUsuario}
        acaoDireita={
          <TouchableOpacity
            onPress={() => router.push("/notificacoes")}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Notificações"
            style={{
              width: 42,
              height: 42,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../../assets/Icons/bell.png")}
              style={{ width: 26, height: 26, tintColor: cores.destaque }}
            />
          </TouchableOpacity>
        }
      />

      {/* BOTÃO DE MENU (abre o painel lateral de configurações) */}
      <TouchableOpacity
        style={estilos.menuCirculo}
        onPress={abrirConfiguracoes}
        activeOpacity={0.8}
      >
        <Image
          source={require("../../assets/Icons/menu-burger.png")}
          style={estilos.menuIcone}
        />
      </TouchableOpacity>

      {/* LISTA VERTICAL DE ATIVIDADES */}
      <ScrollView
        contentContainerStyle={estilos.lista}
        showsVerticalScrollIndicator={false}
      >
        {atividades.map((atividade) => (
          <TouchableOpacity
            key={atividade.id}
            style={[
              estilos.etiqueta,
              { backgroundColor: atividade.cor },
              !atividadeDesbloqueada(atividade.id, progressoAtividades) &&
                estilos.etiquetaBloqueada,
            ]}
            onPress={() => abrirDetalhes(atividade)}
            disabled={!atividadeDesbloqueada(atividade.id, progressoAtividades)}
            activeOpacity={0.8}
          >
            <Text style={estilos.textoEtiqueta}>{atividade.titulo}</Text>

            {!atividadeDesbloqueada(atividade.id, progressoAtividades) ? (
              <Image
                source={require("../../assets/Icons/lock.png")}
                style={estilos.iconeCadeado}
              />
            ) : (
              <CirculoProgresso
                porcentagem={progressoAtividades[atividade.id] ?? 0}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MODAL DE DESCRIÇÃO — aparece quando "selecionada" não é null */}
      <JanelaModal visivel={!!selecionada} aoFechar={() => setSelecionada(null)}>
        <Text style={[estilos.modalTitulo, { color: cores.destaque }]}>
          {selecionada?.titulo}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Fechar detalhes da atividade"
            onPress={() => setSelecionada(null)}
            style={estilos.botaoFecharModal}
          >
            <Text style={[estilos.textoFecharModal, { color: cores.destaque }]}>
              ✕
            </Text>
          </TouchableOpacity>
        </Text>
        <Text style={[estilos.modalDescricao, { color: cores.texto }]}>
          {selecionada?.descricao}
        </Text>
        <TouchableOpacity style={estilos.modalBotao} onPress={iniciarAtividade}>
          <Text style={estilos.textoAcao}>Começar</Text>
        </TouchableOpacity>
      </JanelaModal>

      {/* ABA LATERAL DE CONFIGURAÇÕES — painel branco que abre ao clicar no botão do menu */}
      <Modal
        visible={configuracoesAberta}
        transparent
        animationType="slide"
        onRequestClose={() => setConfiguracoesAberta(false)}
      >
        <View style={estilos.sobreposicaoPainel}>
          <TouchableOpacity
            style={estilos.fundoPainel}
            activeOpacity={1}
            onPress={() => setConfiguracoesAberta(false)}
          />

          <View
            style={[estilos.painelLateral, { backgroundColor: cores.superficie }]}
          >
            <View style={estilos.cabecalhoPainel}>
              <Text style={[estilos.tituloPainel, { color: cores.destaque }]}>
                Configurações
              </Text>
              <TouchableOpacity onPress={() => setConfiguracoesAberta(false)}>
                <Text style={[estilos.fecharPainel, { color: cores.destaque }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                estilos.itemConfiguracao,
                { backgroundColor: cores.superficieSuave },
              ]}
              onPress={() => {
                setConfiguracoesAberta(false);
                router.push("/sobre");
              }}
            >
              <Text style={[estilos.textoConfiguracao, { color: cores.texto }]}>
                Sobre o app
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                estilos.itemConfiguracao,
                { backgroundColor: cores.superficieSuave },
              ]}
              onPress={() => {
                setConfiguracoesAberta(false);
                router.push("/opiniao");
              }}
            >
              <Text style={[estilos.textoConfiguracao, { color: cores.texto }]}>
                Opinião
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                estilos.itemConfiguracao,
                { backgroundColor: cores.superficieSuave },
              ]}
              onPress={() => {
                setConfiguracoesAberta(false);
                router.push("/ajuda");
              }}
            >
              <Text style={[estilos.textoConfiguracao, { color: cores.texto }]}>
                Ajuda
              </Text>
            </TouchableOpacity>

            <View
              style={[
                estilos.itemConfiguracao,
                estilos.temaItem,
                { backgroundColor: cores.superficieSuave },
              ]}
            >
              <Text style={[estilos.textoConfiguracao, { color: cores.texto }]}>
                Tema escuro
              </Text>
              <Switch
                value={escuro}
                onValueChange={(valor) => {
                  void definirTemaEscuro(valor).catch(() => {
                    aviso(
                      "Erro",
                      "Não foi possível salvar a preferência de tema.",
                    );
                  });
                }}
                trackColor={{ false: cores.borda, true: cores.destaque }}
              />
            </View>

            <TouchableOpacity
              style={[
                estilos.itemConfiguracao,
                { backgroundColor: cores.superficieSuave },
              ]}
              onPress={() => void sair()}
            >
              <Text style={[estilos.textoConfiguracao, { color: cores.texto }]}>
                Sair
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[estilos.modalBotao, { backgroundColor: cores.destaque }]}
              onPress={() => setConfiguracoesAberta(false)}
            >
              <Text style={estilos.textoAcao}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ESTILOS DA TELA
const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
    backgroundColor: "#fff",
  },

  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  trilhoProgresso: {
    flex: 1,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E5E5E5",
    overflow: "hidden",
  },

  preenchimentoProgresso: {
    height: "100%",
    backgroundColor: "#2400FF",
    borderRadius: 8,
  },

  sino: {
    width: 24,
    height: 24,
  },

  menuCirculo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2400FF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 20,
    marginTop: 10,
  },

  menuIcone: {
    width: 22,
    height: 22,
  },

  lista: {
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120, // espaço pra não ficar atrás da tab bar flutuante
  },

  etiqueta: {
    height: 70,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },

  etiquetaBloqueada: {
    opacity: 0.85,
  },

  textoEtiqueta: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  iconeCadeado: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },

  modalTitulo: {
    color: "#2400FF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  modalCabecalho: {
    alignItems: "flex-end",
  },

  botaoFecharModal: {
    width: 36,
    height: 36,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  textoFecharModal: {
    fontSize: 22,
    fontWeight: "bold",
  },

  modalDescricao: {
    color: "#333",
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },

  modalBotao: {
    backgroundColor: "#2400FF",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
  },

  textoAcao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  sobreposicaoPainel: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  fundoPainel: {
    flex: 1,
  },

  painelLateral: {
    width: "78%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },

  cabecalhoPainel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  tituloPainel: {
    color: "#2400FF",
    fontSize: 24,
    fontWeight: "bold",
  },

  fecharPainel: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
  },

  itemConfiguracao: {
    backgroundColor: "#F3F3F7",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  textoConfiguracao: {
    color: "#1C1C1E",
    fontSize: 15,
    fontWeight: "600",
  },

  temaItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
