"""Gera e verifica hashes de senha usando as funções seguras do Werkzeug."""

from werkzeug.security import generate_password_hash, check_password_hash


class Criptografia:
    """Hash e verificação de senhas com PBKDF2-SHA256 (werkzeug)."""

    METODO = "pbkdf2:sha256:600000"

    @staticmethod
    def hash_senha(senha: str) -> str:
        if not senha:
            raise ValueError("Senha não pode ser vazia")
        return generate_password_hash(senha, method=Criptografia.METODO)

    @staticmethod
    def verificar_senha(senha: str, hash_armazenado: str) -> bool:
        if not senha or not hash_armazenado:
            return False
        try:
            return check_password_hash(hash_armazenado, senha)
        except (ValueError, TypeError):
            return False

    @staticmethod
    def precisa_rehash(hash_armazenado: str) -> bool:
        """True se o hash foi gerado com um método mais fraco que o atual."""
        if not hash_armazenado:
            return False
        return not hash_armazenado.startswith(Criptografia.METODO)