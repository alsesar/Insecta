"""Filtra padrões suspeitos de SQL como camada adicional de segurança."""

import re


# Padrões reais de SQL injection. Não bloqueiam emails, senhas com !@#$,
# UUIDs, nomes com espaço, acentos etc.
_PADROES_SQLI = [
    r"\bor\b\s+['\"]?\d+['\"]?\s*=\s*['\"]?\d+",   # OR 1=1, OR '1'='1'
    r"\band\b\s+['\"]?\d+['\"]?\s*=\s*['\"]?\d+",  # AND 1=1
    r"\bunion\b\s+(\ball\b\s+)?\bselect\b",         # UNION [ALL] SELECT
    r"\bdrop\b\s+\btable\b",
    r"\bdelete\b\s+\bfrom\b",
    r"\binsert\b\s+\binto\b",
    r"\bupdate\b\s+\w+\s+\bset\b",
    r"\btruncate\b\s+\btable\b",
    r"\bcreate\b\s+\btable\b",
    r"\balter\b\s+\btable\b",
    r";\s*(drop|delete|update|insert|create|alter|truncate|select)\b",
    r"--",                                          # comentário SQL
    r"/\*.*\*/",                                    # comentário em bloco
    r"\bsleep\b\s*\(",
    r"\bpg_sleep\b",
    r"\bxp_cmdshell\b",
    r"\bload_file\b",
    r"\binto\s+outfile\b",
    r"\binformation_schema\b",
    r"\bpg_catalog\b",
    r"\bpg_shadow\b",
    r"\bpg_authid\b",
]


class FiltroDePadroesSql:
    @staticmethod
    def verificacao(dado):
        """
        Retorna True se o dado for seguro (sem padrão aparente de SQL injection)
        e False se detectar padrão suspeito.

        Importante: como o projeto usa queries parametrizadas (%s), esta é uma
        camada EXTRA de defesa. A proteção principal contra SQL injection já
        está garantida pelo driver psycopg.
        """
        if dado is None:
            return True
        entrada = str(dado).lower()
        for padrao in _PADROES_SQLI:
            if re.search(padrao, entrada):
                return False
        return True