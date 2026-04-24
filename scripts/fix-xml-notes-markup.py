#!/usr/bin/env python3
"""
Entity-aware: replace < and > with U+FF1C/U+FF1E outside of fenced code blocks
so <body> / <script> are not injected as real HTML (blank page in Astro MD render).
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / "src/data/blog/xml-notes.md"

ENTITY = re.compile(r"(&(?:#(?:x[0-9A-Fa-f]+|[0-9]+)|[A-Za-z][A-Za-z0-9]*);)")


def replace_angle_brackets_preserve_entities(s: str) -> str:
    parts = ENTITY.split(s)
    out: list[str] = []
    for p in parts:
        if p.startswith("&") and p.endswith(";") and p != p.replace("&", ""):
            out.append(p)
        else:
            out.append(p.replace("<", "＜").replace(">", "＞"))
    return "".join(out)


def restore_blockquotes(s: str) -> str:
    """'＞' at line start (U+FF1E) is usually a mistaken escaped Markdown blockquote '>'."""
    lines = s.splitlines(keepends=True)
    fixed: list[str] = []
    for line in lines:
        if line.startswith("＞"):
            if len(line) > 1 and line[1] in " 　":
                line = ">" + line[1:]
            elif line.strip() == "＞":
                line = ">\n"
        fixed.append(line)
    return "".join(fixed)


def main() -> None:
    text = path.read_text(encoding="utf-8")
    # Split: keep ```...``` blocks unchanged (rare; allows future fencing)
    pieces = re.split(r"(```[\s\S]*?```)", text)
    out: list[str] = []
    for i, p in enumerate(pieces):
        if i % 2 == 0:
            t = replace_angle_brackets_preserve_entities(p)
            out.append(restore_blockquotes(t))
        else:
            out.append(p)
    new_text = "".join(out)
    path.write_text(new_text, encoding="utf-8")
    print("OK", path, "len", len(new_text))


if __name__ == "__main__":
    main()
