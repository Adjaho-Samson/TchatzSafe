#!/usr/bin/env python3
"""Compatibilité : génération du sprite Font Awesome avec le script Node partagé."""
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parent.parent
subprocess.run(['node', str(root / 'tools/build-icons.cjs')], check=True, cwd=root)
