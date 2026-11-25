// ROTA DINÂMICA DA ATIVIDADE (cada item do catálogo recebe um id na URL)
import DetalheAtividade from "@/componentes/atividades/[id]";

export default function RotaDetalheAtividade() {
  return <DetalheAtividade />;
}
