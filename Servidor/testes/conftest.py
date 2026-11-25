"""Prepara o caminho de importação dos módulos para a suíte pytest."""

import sys
from pathlib import Path


DIRETORIO_BACKEND = Path(__file__).resolve().parents[1]
if str(DIRETORIO_BACKEND) not in sys.path:
    sys.path.insert(0, str(DIRETORIO_BACKEND))
