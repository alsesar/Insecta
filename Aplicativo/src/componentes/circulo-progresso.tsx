// Desenha um indicador circular a partir do percentual recebido.
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type CirculoProgressoProps = {
  porcentagem: number; // de 0 a 100
  tamanho?: number;
  espessura?: number;
  cor?: string;
  corFundo?: string;
};

export function CirculoProgresso({
  porcentagem,
  tamanho = 36,
  espessura = 4,
  cor = "#fff",
  corFundo = "rgba(255,255,255,0.3)",
}: CirculoProgressoProps) {
  const raio = (tamanho - espessura) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const preenchido = circunferencia * (porcentagem / 100);

  return (
    <View style={{ width: tamanho, height: tamanho }}>
      <Svg width={tamanho} height={tamanho}>
        <Circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          stroke={corFundo}
          strokeWidth={espessura}
          fill="none"
        />
        <Circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          stroke={cor}
          strokeWidth={espessura}
          fill="none"
          strokeDasharray={`${circunferencia} ${circunferencia}`}
          strokeDashoffset={circunferencia - preenchido}
          strokeLinecap="round"
          rotation={-90}
          origin={`${tamanho / 2}, ${tamanho / 2}`}
        />
      </Svg>
    </View>
  );
}
