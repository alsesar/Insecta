#!/usr/bin/env node

/**
 * Restaura a estrutura inicial do projeto.
 * Conforme a resposta, move ou remove as pastas do aplicativo e cria telas vazias.
 * Execute somente quando realmente quiser substituir a estrutura atual.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const raiz = process.cwd();
const diretoriosAntigos = ["src", "roteiros"];
const diretorioExemplo = "exemplo";
const diretorioAplicativo = "src/app";
const caminhoDiretorioExemplo = path.join(raiz, diretorioExemplo);

const conteudoIndice = `import { Text, View, StyleSheet } from "react-native";

export default function Inicio() {
  return (
    <View style={estilos.conteiner}>
      <Text>Edite src/app/index.tsx para alterar esta tela.</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  conteiner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
`;

const conteudoLayout = `import { Stack } from "expo-router";

export default function LayoutRaiz() {
  return <Stack />;
}
`;

const leitor = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moverDiretorios = async (respostaUsuario) => {
  try {
    if (respostaUsuario === "s") {
      // Guarda os arquivos antigos antes de criar a estrutura limpa.
      await fs.promises.mkdir(caminhoDiretorioExemplo, { recursive: true });
      console.log(`📁 Pasta /${diretorioExemplo} criada.`);
    }

    // Esta opção remove definitivamente as pastas existentes.
    for (const diretorio of diretoriosAntigos) {
      const caminhoAntigo = path.join(raiz, diretorio);
      if (fs.existsSync(caminhoAntigo)) {
        if (respostaUsuario === "s") {
          const caminhoNovo = path.join(raiz, diretorioExemplo, diretorio);
          await fs.promises.rename(caminhoAntigo, caminhoNovo);
          console.log(`➡️ /${diretorio} movida para /${diretorioExemplo}/${diretorio}.`);
        } else {
          await fs.promises.rm(caminhoAntigo, { recursive: true, force: true });
          console.log(`❌ /${diretorio} removida.`);
        }
      } else {
        console.log(`➡️ /${diretorio} não existe; ignorada.`);
      }
    }

    // Recria as telas mínimas esperadas pelo Expo Router.
    const caminhoAplicativo = path.join(raiz, diretorioAplicativo);
    await fs.promises.mkdir(caminhoAplicativo, { recursive: true });
    console.log("\n📁 Nova pasta /src/app criada.");

    const caminhoIndice = path.join(caminhoAplicativo, "index.tsx");
    await fs.promises.writeFile(caminhoIndice, conteudoIndice);
    console.log("📄 src/app/index.tsx criado.");

    const caminhoLayout = path.join(caminhoAplicativo, "_layout.tsx");
    await fs.promises.writeFile(caminhoLayout, conteudoLayout);
    console.log("📄 src/app/_layout.tsx criado.");

    console.log("\n✅ Estrutura reiniciada. Próximas etapas:");
    console.log(
      `1. Execute \`npx expo start\` para iniciar o servidor de desenvolvimento.\n2. Edite src/app/index.tsx para alterar a tela principal.\n3. Coloque o código do aplicativo em /src; somente telas e layouts devem ficar em /src/app.${
        respostaUsuario === "s"
          ? `\n4. Remova a pasta /${diretorioExemplo} quando não precisar mais dos arquivos antigos.`
          : ""
      }`
    );
  } catch (erro) {
    console.error(`❌ Erro durante a execução do script: ${erro.message}`);
  }
};

leitor.question(
  "Deseja mover os arquivos existentes para /exemplo em vez de removê-los? (S/n): ",
  (resposta) => {
    const respostaUsuario = resposta.trim().toLowerCase() || "s";
    if (respostaUsuario === "s" || respostaUsuario === "n") {
      moverDiretorios(respostaUsuario).finally(() => leitor.close());
    } else {
      console.log("❌ Resposta inválida. Digite 'S' ou 'N'.");
      leitor.close();
    }
  }
);
