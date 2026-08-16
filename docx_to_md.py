#!/usr/bin/env python3
"""将 DOCX 转换为结构化 Markdown。

用法：
    python docx_to_md.py input.docx [output.md]

如果不指定输出路径，将在源文件旁生成同名 .md 文件。
"""

from __future__ import annotations

import argparse
from pathlib import Path

from docx import Document
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph


def clean(text: str) -> str:
    return text.replace("\xa0", "").strip()


def format_line(line: str) -> str:
    line = clean(line)
    if not line:
        return ""
    if line.startswith("✅"):
        return f"- {line}"
    if "：" in line:
        label, value = line.split("：", 1)
        if label and len(label) <= 24:
            return f"**{label}：**{value.strip()}"
    return line


def paragraph_to_md(paragraph: Paragraph) -> str:
    text = clean(paragraph.text)
    if not text:
        return ""

    style = paragraph.style.name if paragraph.style else ""
    if style.startswith("Heading"):
        try:
            level = int(style.split()[-1])
        except ValueError:
            level = 3
        return f"{'#' * level} {text}"

    lines = [format_line(line) for line in text.splitlines()]
    lines = [line for line in lines if line]
    if text.startswith("口播") and len(lines) > 1:
        return lines[0] + "\n\n> " + "\n> ".join(lines[1:])
    return "\n".join(lines)


def table_to_md(table: Table) -> str:
    rows = []
    for row in table.rows:
        rows.append([
            clean(cell.text).replace("|", "\\|").replace("\n", "<br>")
            for cell in row.cells
        ])
    if not rows:
        return ""

    width = max(len(row) for row in rows)
    rows = [row + [""] * (width - len(row)) for row in rows]
    result = [
        "| " + " | ".join(rows[0]) + " |",
        "| " + " | ".join(["---"] * width) + " |",
    ]
    result.extend("| " + " | ".join(row) + " |" for row in rows[1:])
    return "\n".join(result)


def iter_blocks(document):
    for child in document.element.body.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, document)
        elif isinstance(child, CT_Tbl):
            yield Table(child, document)


def convert(source: Path, destination: Path) -> None:
    document = Document(source)
    parts = [f"# {destination.stem}", "", f"> 源文件：`{source.name}`", ""]

    for block in iter_blocks(document):
        if isinstance(block, Paragraph):
            content = paragraph_to_md(block)
        else:
            content = table_to_md(block)
        if content:
            parts.extend([content, ""])

    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text("\n".join(parts).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="将 DOCX 转换为 Markdown")
    parser.add_argument("source", type=Path, help="源 DOCX 文件")
    parser.add_argument("destination", type=Path, nargs="?", help="目标 Markdown 文件")
    args = parser.parse_args()

    source = args.source.expanduser().resolve()
    destination = args.destination or source.with_suffix(".md")
    destination = destination.expanduser().resolve()
    convert(source, destination)
    print(destination)


if __name__ == "__main__":
    main()
