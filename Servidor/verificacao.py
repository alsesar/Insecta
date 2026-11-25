"""Valida campos e regras de senha usadas pelo backend."""


class Verificacoes:
    @staticmethod
    def verificar_senha_forte(senha):   
        if len(senha) < 8:
            return False
        if not any(c.isupper() for c in senha):
            return False
        if not any(c.islower() for c in senha):
            return False
        if not any(c.isdigit() for c in senha):
            return False
        if not any(c in "!@#$%^&*()_+-=[]{}|;':\"<>,./?" for c in senha):
            return False
        return True

    @staticmethod
    def verificar_senha_igual(senha, confirmar_senha):  
        return senha == confirmar_senha

    @staticmethod
    def verificar_campos(campo):           
        return bool(campo and campo.strip())