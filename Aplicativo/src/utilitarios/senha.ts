// Repete no cliente a regra visual de senha; a validação definitiva é do servidor.
export function senhaValida(senha: string): boolean {
  return (
    senha.length >= 8 &&
    /[a-z]/.test(senha) &&
    /[A-Z]/.test(senha) &&
    /\d/.test(senha) &&
    /[^A-Za-z0-9]/.test(senha)
  );
}
