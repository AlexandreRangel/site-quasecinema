#!/usr/bin/env python3
"""Regenera sitemap.xml com lastmod vindo do git (data do último commit de cada página).

Uso: python scripts/sitemap.py
Sem dependências externas. Rodar antes de publicar quando alguma página mudar.
"""
from __future__ import annotations

import subprocess
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://quasecinema.org"
# Ordem: home primeiro, depois as páginas internas. 404.html é noindex: fica fora.
PAGES = ["index.html", "sobre.html", "trabalhos.html", "suporte.html", "privacidade.html"]


def last_commit_date(path: Path) -> str:
    """Data (YYYY-MM-DD) do último commit que tocou o arquivo; hoje se não houver commit."""
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", path.name],
            cwd=ROOT, capture_output=True, text=True, check=False,
        ).stdout.strip()
    except OSError:
        out = ""
    return out or date.today().isoformat()


def build() -> str:
    """XML do sitemap com uma <url> por página."""
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for name in PAGES:
        loc = SITE + "/" if name == "index.html" else f"{SITE}/{name}"
        lines.append(f"  <url><loc>{loc}</loc><lastmod>{last_commit_date(ROOT / name)}</lastmod></url>")
    lines.append("</urlset>")
    return "\r\n".join(lines) + "\r\n"


def main() -> None:
    """Escreve sitemap.xml na raiz do repo."""
    target = ROOT / "sitemap.xml"
    target.write_text(build(), encoding="utf-8", newline="")
    print(f"sitemap.xml atualizado ({len(PAGES)} URLs)")


if __name__ == "__main__":
    main()
