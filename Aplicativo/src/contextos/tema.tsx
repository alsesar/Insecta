// Compartilha as cores atuais e persiste a preferência de tema no dispositivo.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

const CHAVE_TEMA = "temaEscuro";

export type CoresDoAplicativo = {
  fundo: string;
  superficie: string;
  superficieSuave: string;
  texto: string;
  textoSecundario: string;
  borda: string;
  destaque: string;
  trilho: string;
  textoBotao: string;
};

type TemaContexto = {
  escuro: boolean;
  cores: CoresDoAplicativo;
  definirTemaEscuro: (escuro: boolean) => Promise<void>;
};

const coresClaras: CoresDoAplicativo = {
  fundo: "#FFFFFF",
  superficie: "#FFFFFF",
  superficieSuave: "#F3F3F7",
  texto: "#1C1C1E",
  textoSecundario: "#62626B",
  borda: "#D9D9E0",
  destaque: "#2400FF",
  trilho: "#E5E5E5",
  textoBotao: "#FFFFFF",
};

const coresEscuras: CoresDoAplicativo = {
  fundo: "#15151B",
  superficie: "#202027",
  superficieSuave: "#2A2A33",
  texto: "#F5F5F7",
  textoSecundario: "#B8B8C2",
  borda: "#41414C",
  destaque: "#A9AEFF",
  trilho: "#3A3A45",
  textoBotao: "#FFFFFF",
};

const ContextoTema = createContext<TemaContexto | null>(null);

export function ProvedorDeTema({ children }: { children: ReactNode }) {
  const [escuro, setEscuro] = useState(false);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    let ativo = true;
    AsyncStorage.getItem(CHAVE_TEMA)
      .then((valor) => {
        if (!ativo) return;
        const preferenciaEscura = valor === "true";
        setEscuro(preferenciaEscura);
        Appearance.setColorScheme(preferenciaEscura ? "dark" : "light");
      })
      .catch(() => {})
      .finally(() => {
        if (ativo) setCarregado(true);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function definirTemaEscuro(proximoTema: boolean) {
    const temaAnterior = escuro;
    setEscuro(proximoTema);
    Appearance.setColorScheme(proximoTema ? "dark" : "light");
    try {
      await AsyncStorage.setItem(CHAVE_TEMA, String(proximoTema));
    } catch (erro) {
      setEscuro(temaAnterior);
      Appearance.setColorScheme(temaAnterior ? "dark" : "light");
      throw erro;
    }
  }

  if (!carregado) return null;

  return (
    <ContextoTema.Provider
      value={{
        escuro,
        cores: escuro ? coresEscuras : coresClaras,
        definirTemaEscuro,
      }}
    >
      <StatusBar style={escuro ? "light" : "dark"} />
      {children}
    </ContextoTema.Provider>
  );
}

export function useTema() {
  const contexto = useContext(ContextoTema);
  if (!contexto)
    throw new Error("useTema deve ser usado dentro de ProvedorDeTema");
  return contexto;
}
