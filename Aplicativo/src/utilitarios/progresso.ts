// Reúne cálculos puros de progresso usados pelas telas sem acessar a rede.
export type ProgressoAtividades = Record<string, number>;

export const TOTAL_ATIVIDADES = 7;

export function atividadeDesbloqueada(
  id: number,
  progresso: ProgressoAtividades,
) {
  return id === 1 || progresso[String(id - 1)] === 100;
}

export function calcularProgressoGeral(progresso: ProgressoAtividades) {
  const soma = Object.values(progresso).reduce(
    (total, valor) => total + valor,
    0,
  );
  return soma / (TOTAL_ATIVIDADES * 100);
}
