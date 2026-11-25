import { Botao } from "@/componentes/botao";
import { useTema } from "@/contextos/tema";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import type { ImageSourcePropType } from "react-native";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SecaoConteudo = {
  titulo: string;
  texto: string;
  imagem?: ImageSourcePropType;
};

type ConteudoAtividade = {
  titulo: string;
  introducao: string;
  imagem?: ImageSourcePropType;
  secoes: SecaoConteudo[];
};

const conteudosPorAtividade: Record<number, ConteudoAtividade> = {
  1: {
    titulo: "Conhecendo o hardware",
    introducao:
      "Hardware é a parte física do computador: os componentes que podemos ver e tocar.",
    imagem: require("../../assets/Joana/JoanaU1.png"),
    secoes: [
      {
        titulo: "Processador (CPU)",
        texto:
          "A CPU executa instruções e realiza cálculos. Ela trabalha junto com os outros componentes para que os programas funcionem.",
        imagem: require("../../assets/Joana/JoanaU2.png"),
      },
      {
        titulo: "Memória RAM",
        texto:
          "A RAM guarda temporariamente os dados dos programas que estão em uso. Seu conteúdo é apagado quando o computador é desligado.",
        imagem: require("../../assets/Joana/JoanaU4.png"),
      },
      {
        titulo: "Armazenamento",
        texto:
          "O SSD ou o HD guarda arquivos e programas mesmo quando o computador está desligado. O SSD costuma ser mais rápido.",
        imagem: require("../../assets/Joana/JoanaU1.png"),
      },
      {
        titulo: "Placa-mãe",
        texto:
          "A placa-mãe conecta todos os componentes do computador, permitindo que eles se comuniquem e funcionem juntos.",
        imagem: require("../../assets/Joana/JoanaU2.png"),
      },
    ],
  },
  2: {
    titulo: "Segurança digital",
    introducao:
      "Pequenos cuidados ajudam a proteger suas contas, seus dispositivos e suas informações pessoais.",
      imagem: require("../../assets/Joana/JoanaU2.png"),
    secoes: [
      {
        titulo: "Senhas fortes",
        texto:
          "Prefira senhas longas e únicas. Evite reutilizar a mesma senha em vários serviços. Ao utilizar a mesma senha em diferentes serviços, se um deles for comprometido, todos os outros também estarão em risco.",
        imagem: require("../../assets/Joana/JoanaU4.png"),
      },
      {
        titulo: "Links e mensagens",
        texto:
          "Desconfie de mensagens inesperadas que pedem senhas ou dados pessoais, pode ser um golpe. Confirme a solicitação por um canal oficial antes de agir.",
        imagem: require("../../assets/Joana/JoanaU1.png"),  
      },
      {
        titulo: "Verificação em duas etapas",
        texto:
          "Quando disponível, ative uma segunda etapa de verificação. Ela adiciona uma proteção além da senha.",
        imagem: require("../../assets/Joana/JoanaU2.png"),
      },
      {
        titulo: "Tipos de golpes virtuais",
        texto:
          "Uma prática comum é o phishing, que tenta enganar você para obter informações pessoais. Fique atento a mensagens suspeitas e links desconhecidos.",
        imagem: require("../../assets/Joana/JoanaU4.png"),
      }
    ],
  },
  3: {
    titulo: "Navegando pela internet",
    introducao:
      "A internet permite acessar páginas e informações. Saber pesquisar e avaliar fontes ajuda a encontrar conteúdo confiável.",
    imagem: require("../../assets/Joana/JoanaU4.png"),
    secoes: [
      {
        titulo: "Navegador e endereço",
        texto:
          "O navegador abre páginas da internet. A URL, exibida na barra de endereços, identifica uma página ou site.",
        imagem: require("../../assets/Joana/JoanaU1.png"),
      },
      {
        titulo: "Pesquisa",
        texto:
          "Use palavras-chave específicas para encontrar resultados mais relevantes em um mecanismo de busca.",
        imagem: require("../../assets/Joana/JoanaU2.png"),
      },
      {
        titulo: "Confiabilidade",
        texto:
          "Confira quem publicou a informação, quando foi publicada e se outras fontes confiáveis confirmam o conteúdo. Cuidado com notícias falsas e desinformação!!!",
        imagem: require("../../assets/Joana/JoanaU4.png"),
      },
    ],
  },
  4: {
    titulo: "Sistemas operacionais",
    introducao:
      "O sistema operacional administra o computador e permite usar aplicativos e dispositivos.",
    imagem: require("../../assets/Joana/JoanaU2.png"),
    secoes: [
      {
        titulo: "O que é o sistema operacional",
        texto:
          "O sistema operacional é o software principal do computador. Ele gerencia recursos, permite a execução de aplicativos e facilita a interação com o usuário.",
        imagem: require("../../assets/Joana/JoanaU4.png"),
      },
      {
        titulo: "Área de trabalho, menu e barra de tarefas",
        texto:
          "A área de trabalho exibe ícones e atalhos. O menu oferece acesso a aplicativos e configurações. A barra de tarefas mostra programas em execução e notificações.",
        imagem: require("../../assets/Joana/JoanaU2.png"),
      },
      {
        titulo: "Aplicativos e tarefas",
        texto:
          "Você pode abrir aplicativos para realizar tarefas e alternar entre eles conforme necessário.",
        imagem: require("../../assets/Joana/JoanaU1.png"),
      },
      {
        titulo: "Atualizações",
        texto:
          "Atualizações podem trazer melhorias e correções. Instale-as usando os recursos oficiais do sistema.",
        imagem: require("../../assets/Joana/JoanaU2.png"),
      },
    ],
  },
  5: {
    titulo: "Organizando arquivos",
    introducao:
      "Pastas e nomes claros ajudam a guardar documentos e encontrá-los depois.",
    imagem: require("../../assets/Joana/JoanaU1.png"),
    secoes: [
      {
        titulo: "Pastas",
        texto:
          "Crie pastas para agrupar arquivos relacionados, por exemplo, por assunto ou projeto. Pastas organizadas facilitam a localização de arquivos e mantêm o computador mais organizado.",
        imagem: require("../../assets/Joana/JoanaU2.png"),
      },
      {
        titulo: "Nomes de arquivos",
        texto:
          "Escolha nomes que expliquem o conteúdo. A extensão, como .pdf, geralmente indica o formato do arquivo.",
        imagem: require("../../assets/Joana/JoanaU4.png"),
      },
      {
        titulo: "Mover arquivos",
        texto:
          "Ao mover um arquivo, ele passa a ficar em outro local. Confira a pasta de destino para manter tudo organizado.",
        imagem: require("../../assets/Joana/JoanaU1.png"),
      },
    ],
  },
  6: {
    titulo: "Comunicação digital",
    introducao:
      "A comunicação online funciona melhor quando escolhemos a ferramenta adequada e respeitamos as outras pessoas.",
    imagem: require("../../assets/Joana/JoanaU4.png"),
    secoes: [
      {
        titulo: "Escolha da ferramenta",
        texto:
          "Use uma ferramenta apropriada para a conversa e para as pessoas envolvidas.",
        imagem: require("../../assets/Joana/JoanaU2.png"),
      },
      {
        titulo: "Clareza e respeito",
        texto:
          "Escreva mensagens objetivas e respeitosas. Antes de enviar um email, confira o destinatário, o assunto e os anexos.",
        imagem: require("../../assets/Joana/JoanaU1.png"),
      },
      {
        titulo: "Privacidade",
        texto:
          "Internet não é terra sem lei! Peça autorização antes de compartilhar fotos ou mensagens privadas de outras pessoas.",
        imagem: require("../../assets/Joana/JoanaU4.png"),
      },
      {
        titulo: "Segurança pessoal",
        texto: "Evite espalhar suas informações pessoais na internet. Compartilhe apenas o necessário e com pessoas de confiança.",
        imagem: require("../../assets/Joana/JoanaU2.png"),
      },
    ],
  },
  7: {
    titulo: "Desafio final",
    introducao:
      "Esta atividade reúne conceitos de hardware, segurança digital e uso da internet. Boa sorte!",
    imagem: require("../../assets/Joana/JoanaU2.png"),
    secoes: [],
  },
};

export default function PaginaConteudo() {
  const { cores } = useTema();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idAtividade = Number(id);
  const conteudo = conteudosPorAtividade[idAtividade];
  const [etapaAtual, setEtapaAtual] = useState(0);

  useEffect(() => {
    setEtapaAtual(0);
  }, [idAtividade]);

  if (!conteudo) {
    return (
      <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
        <View style={estilos.estadoVazio}>
          <Text style={[estilos.titulo, { color: cores.destaque }]}>
            Conteúdo não encontrado
          </Text>
          <Botao rotulo="Voltar" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const secaoAtual =
    etapaAtual === 0 ? null : conteudo.secoes[etapaAtual - 1];
  const ultimaEtapa = etapaAtual === conteudo.secoes.length;

  return (
    <SafeAreaView style={[estilos.areaSegura, { backgroundColor: cores.fundo }]}>
      <ScrollView contentContainerStyle={estilos.conteudoRolavel}>
        <View style={estilos.conteudo}>
          <Text style={[estilos.identificacao, { color: cores.textoSecundario }]}>
            Atividade {idAtividade}
          </Text>
          <Text style={[estilos.titulo, { color: cores.destaque }]}>
            {conteudo.titulo}
          </Text>

          {secaoAtual ? (
            <View
              style={[
                estilos.cartao,
                { backgroundColor: cores.superficieSuave },
              ]}
            >
              <Text style={[estilos.tituloSecao, { color: cores.destaque }]}>
                {secaoAtual.titulo}
              </Text>
              <View style={estilos.containerTexto}>
                <Text
                  style={[
                    estilos.textoSecao,
                    { color: cores.textoSecundario },
                  ]}
                >
                  {secaoAtual.texto}
                </Text>
              </View>
              {secaoAtual.imagem && (
                <View
                  style={[
                    estilos.containerImagem,
                    { backgroundColor: cores.fundo },
                  ]}
                >
                  <Image
                    source={secaoAtual.imagem}
                    resizeMode="contain"
                    style={estilos.imagem}
                    accessibilityLabel="Ilustração da seção"
                  />
                </View>
              )}
            </View>
          ) : (
            <View
              style={[
                estilos.cartao,
                { backgroundColor: cores.superficieSuave },
              ]}
            >
              <Text style={[estilos.tituloSecao, { color: cores.destaque }]}>
                Introdução
              </Text>
              <Text style={[estilos.textoSecao, { color: cores.texto }]}>
                {conteudo.introducao}
              </Text>
              {conteudo.imagem && (
                <View
                  style={[
                    estilos.containerImagem,
                    { backgroundColor: cores.fundo },
                  ]}
                >
                  <Image
                    source={conteudo.imagem}
                    resizeMode="contain"
                    style={estilos.imagem}
                    accessibilityLabel="Ilustração da seção"
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[estilos.rodape, { backgroundColor: cores.fundo }]}>
        <View style={estilos.navegacao}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Seção anterior"
            disabled={etapaAtual === 0}
            onPress={() => setEtapaAtual((atual) => atual - 1)}
            style={[
              estilos.botaoSeta,
              { backgroundColor: cores.superficieSuave },
              etapaAtual === 0 && estilos.botaoDesativado,
            ]}
          >
            <Text style={[estilos.textoSeta, { color: cores.destaque }]}>
              ←
            </Text>
          </TouchableOpacity>

          <Text style={[estilos.indicador, { color: cores.textoSecundario }]}>
            {etapaAtual === 0
              ? "Introdução"
              : `Seção ${etapaAtual} de ${conteudo.secoes.length}`}
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Próxima seção"
            disabled={ultimaEtapa}
            onPress={() =>
              setEtapaAtual((atual) =>
                Math.min(atual + 1, conteudo.secoes.length),
              )
            }
            style={[
              estilos.botaoSeta,
              { backgroundColor: cores.superficieSuave },
              ultimaEtapa && estilos.botaoDesativado,
            ]}
          >
            <Text style={[estilos.textoSeta, { color: cores.destaque }]}>
              →
            </Text>
          </TouchableOpacity>
        </View>

        {ultimaEtapa && (
          <Botao
            rotulo="Ir para a atividade"
            onPress={() =>
              router.push({
                pathname: "/questionario/[id]",
                params: { id: String(idAtividade) },
              })
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  areaSegura: {
    flex: 1,
  },
  conteudoRolavel: {
    padding: 24,
    paddingBottom: 16,
  },
  conteudo: {
    gap: 16,
  },
  estadoVazio: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 20,
  },
  identificacao: {
    fontSize: 14,
    textAlign: "center",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  cartao: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textoSecao: {
    fontSize: 15,
    lineHeight: 22,
  },
  linhaSecao: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  containerTexto: {
    width: "100%",
  },
  containerImagem: {
    width: "100%",
    height: 200,
    marginTop: 8,
    borderRadius: 12,
    padding: 8,
  },
  imagem: {
    width: "100%",
    height: "100%",
  },
  rodape: {
    padding: 24,
    paddingTop: 12,
    gap: 16,
  },
  navegacao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  botaoSeta: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoDesativado: {
    opacity: 0.35,
  },
  textoSeta: {
    fontSize: 28,
    fontWeight: "bold",
  },
  indicador: {
    fontSize: 14,
  },
});