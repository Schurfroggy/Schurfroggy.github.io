import mermaid from "mermaid";

const PROSE = "article.app-prose";

function mermaidTheme(): "default" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "default";
}

function configureMermaid(): void {
  mermaid.initialize({
    startOnLoad: false,
    theme: mermaidTheme(),
    securityLevel: "loose",
    /* Mermaid parses theme at render time: avoid CSS var()/color-mix in theme — breaks render
     * and with suppressErrors the block stays as plain text. */
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    flowchart: { useMaxWidth: true },
    sequence: { useMaxWidth: true },
    gantt: { useMaxWidth: true },
    themeVariables: {
      fontSize: "16px",
    },
  });
}

/**
 * Shiki wraps each line in <span class="line">; code.textContent joins them
 * without newlines, which breaks Mermaid. Reconstruct with line breaks.
 */
function getMermaidDefinitionFromCodeBlock(code: Element): string {
  const lineSpans = code.querySelectorAll("span.line");
  if (lineSpans.length > 0) {
    return Array.from(lineSpans)
      .map(line => (line.textContent ?? "").replace(/\r\n?/g, ""))
      .join("\n")
      .trim();
  }
  return (code.textContent ?? "").trim();
}

/**
 * Finds Shiki-highlighted ```mermaid fences and replaces them with rendered SVG.
 */
export async function initMermaidInProse(): Promise<void> {
  const root = document.querySelector(PROSE);
  if (!root) return;

  /* Astro + Shiki: language is on <pre data-language="mermaid">, not on <code> */
  const pres = root.querySelectorAll("pre[data-language='mermaid']");
  if (!pres.length) return;

  configureMermaid();

  const nodes: HTMLElement[] = [];

  for (const pre of pres) {
    const code = pre.querySelector(":scope > code");
    if (!code) continue;

    const definition = getMermaidDefinitionFromCodeBlock(code);
    if (!definition) continue;

    const wrap = document.createElement("figure");
    wrap.className =
      "mermaid-diagram-wrapper not-prose my-6 w-full min-w-0 overflow-x-auto rounded-lg border border-border/40 bg-muted/10 p-4";
    wrap.setAttribute("data-mermaid-definition", definition);
    wrap.setAttribute("aria-label", "Diagram");

    const inner = document.createElement("div");
    inner.className = "mermaid w-full min-w-0";
    inner.textContent = definition;

    wrap.appendChild(inner);
    pre.replaceWith(wrap);
    nodes.push(inner);
  }

  if (nodes.length === 0) return;

  await mermaid.run({ nodes, suppressErrors: true });
}

/** Re-render diagrams after light/dark toggle (theme CSS variables + mermaid theme). */
export async function refreshMermaidDiagramsForTheme(): Promise<void> {
  const wrappers = document.querySelectorAll(
    `${PROSE} .mermaid-diagram-wrapper[data-mermaid-definition]`
  );
  if (!wrappers.length) return;

  configureMermaid();

  const nodes: HTMLElement[] = [];
  for (const w of wrappers) {
    const def = w.getAttribute("data-mermaid-definition") ?? "";
    if (!def) continue;
    w.replaceChildren();
    const inner = document.createElement("div");
    inner.className = "mermaid w-full min-w-0";
    inner.textContent = def;
    w.appendChild(inner);
    nodes.push(inner);
  }

  if (nodes.length === 0) return;
  await mermaid.run({ nodes, suppressErrors: true });
}

let themeListenerBound = false;

/** Avoid duplicate listeners when scripts re-run (e.g. View Transitions). */
export function ensureMermaidThemeListener(): void {
  if (themeListenerBound) return;
  themeListenerBound = true;
  document.addEventListener("site-theme-reflected", () => {
    void refreshMermaidDiagramsForTheme();
  });
}
