import type { Mermaid } from "mermaid";

const PROSE_SELECTOR = "article.app-prose, article#article.app-prose";

let mermaidApi: Mermaid | null = null;
let mermaidConfigured = false;
let renderIdSeq = 0;
let mermaidLoadPromise: Promise<Mermaid> | null = null;

function getProseRoot(): Element | null {
  return document.querySelector(PROSE_SELECTOR);
}

async function loadMermaid(): Promise<Mermaid> {
  if (mermaidApi) return mermaidApi;
  mermaidLoadPromise ??= import("mermaid").then(mod => {
    mermaidApi = mod.default;
    return mermaidApi;
  });
  return mermaidLoadPromise;
}

function mermaidTheme(): "default" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "default";
}

async function configureMermaid(): Promise<void> {
  const mermaid = await loadMermaid();
  if (mermaidConfigured) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: mermaidTheme(),
    securityLevel: "loose",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    flowchart: { useMaxWidth: true },
    sequence: { useMaxWidth: true },
    gantt: { useMaxWidth: true },
    themeVariables: {
      fontSize: "16px",
    },
  });
  mermaidConfigured = true;
}

async function reconfigureMermaidTheme(): Promise<void> {
  const mermaid = await loadMermaid();
  mermaid.initialize({
    startOnLoad: false,
    theme: mermaidTheme(),
    securityLevel: "loose",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    flowchart: { useMaxWidth: true },
    sequence: { useMaxWidth: true },
    gantt: { useMaxWidth: true },
    themeVariables: {
      fontSize: "16px",
    },
  });
}

/** Join Shiki <span class="line"> when an older build still used highlighting. */
function getMermaidDefinitionFromCodeBlock(code: Element): string {
  const lineSpans = code.querySelectorAll("span.line");
  if (lineSpans.length > 0) {
    return Array.from(lineSpans)
      .map(line => (line.textContent ?? "").replace(/\r\n?/g, ""))
      .join("\n")
      .trim();
  }
  return (code.textContent ?? "").replace(/\r\n?/g, "\n").trim();
}

/**
 * Prefer live <code> text (reliable newlines). `data-mermaid-source` can break when
 * the HTML attribute spans multiple lines.
 */
function getMermaidDefinition(pre: HTMLPreElement, code: Element): string {
  const fromCode = getMermaidDefinitionFromCodeBlock(code);
  if (fromCode) return fromCode;
  const fromAttr =
    pre.getAttribute("data-mermaid-source") ??
    code.getAttribute("data-mermaid-source");
  return fromAttr?.trim() ?? "";
}

function findMermaidPres(root: ParentNode): HTMLPreElement[] {
  const pres = new Set<HTMLPreElement>();
  root
    .querySelectorAll<HTMLPreElement>("pre[data-language='mermaid']")
    .forEach(pre => pres.add(pre));
  root.querySelectorAll<HTMLPreElement>("pre > code.language-mermaid").forEach(code => {
    const pre = code.closest("pre");
    if (pre) pres.add(pre);
  });
  return [...pres];
}

async function renderMermaidInto(
  host: HTMLElement,
  definition: string
): Promise<boolean> {
  const mermaid = await loadMermaid();
  const id = `mermaid-diagram-${++renderIdSeq}`;
  try {
    const { svg, bindFunctions } = await mermaid.render(id, definition);
    host.innerHTML = svg;
    bindFunctions?.(host);
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const staleViteChunk =
      /Failed to fetch dynamically imported module/i.test(message) &&
      /node_modules\/\.vite\/deps/i.test(message);
    console.warn("[mermaid] render failed:", err);
    if (staleViteChunk) {
      console.warn(
        "[mermaid] Stale Vite cache — run: rm -rf node_modules/.vite && npm run dev, then hard-refresh."
      );
    }
    const hint = staleViteChunk
      ? `${message}\n\n（开发环境）请停止 dev 后执行 rm -rf node_modules/.vite && npm run dev，并强制刷新页面。`
      : message;
    host.innerHTML = `<pre class="mermaid-render-error text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">${escapeHtml(
      hint
    )}</pre>`;
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Finds ```mermaid fences and replaces them with rendered SVG.
 */
export async function initMermaidInProse(): Promise<void> {
  const root = getProseRoot();
  if (!root) return;

  const pres = findMermaidPres(root);
  if (!pres.length) return;

  try {
    await configureMermaid();
  } catch (err) {
    console.error("[mermaid] failed to load library:", err);
    return;
  }

  for (const pre of pres) {
    if (pre.closest(".mermaid-diagram-wrapper")) continue;

    const code = pre.querySelector(":scope > code");
    if (!code) continue;

    const definition = getMermaidDefinition(pre, code);
    if (!definition) continue;

    pre.setAttribute("data-language", "mermaid");
    pre.classList.add("mermaid-pending");

    const wrap = document.createElement("figure");
    wrap.className =
      "mermaid-diagram-wrapper not-prose my-6 w-full min-w-0 overflow-x-auto rounded-lg border border-border/40 bg-muted/10 p-4";
    wrap.setAttribute("data-mermaid-definition", definition);
    wrap.setAttribute("aria-label", "Diagram");

    const inner = document.createElement("div");
    inner.className = "mermaid-host w-full min-w-0";

    wrap.appendChild(inner);
    pre.replaceWith(wrap);
    await renderMermaidInto(inner, definition);
  }
}

/** Re-render diagrams after light/dark toggle. */
export async function refreshMermaidDiagramsForTheme(): Promise<void> {
  const root = getProseRoot();
  if (!root) return;

  const wrappers = root.querySelectorAll<HTMLElement>(
    ".mermaid-diagram-wrapper[data-mermaid-definition]"
  );
  if (!wrappers.length) return;

  await reconfigureMermaidTheme();

  for (const w of wrappers) {
    const def = w.getAttribute("data-mermaid-definition") ?? "";
    if (!def) continue;
    const host =
      w.querySelector<HTMLElement>(".mermaid-host") ??
      w.querySelector<HTMLElement>(".mermaid");
    if (!host) continue;
    await renderMermaidInto(host, def);
  }
}

let themeListenerBound = false;

export function ensureMermaidThemeListener(): void {
  if (themeListenerBound) return;
  themeListenerBound = true;
  document.addEventListener("site-theme-reflected", () => {
    void refreshMermaidDiagramsForTheme();
  });
}
