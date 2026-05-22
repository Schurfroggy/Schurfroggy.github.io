/** Shiki / fenced-block language id → terminal title-bar label */
const LANG_LABELS: Record<string, string> = {
  bash: "Bash",
  sh: "Shell",
  shell: "Shell",
  zsh: "Zsh",
  c: "C",
  cpp: "C++",
  "c++": "C++",
  csharp: "C#",
  "c#": "C#",
  css: "CSS",
  go: "Go",
  html: "HTML",
  java: "Java",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  jsx: "JSX",
  kotlin: "Kotlin",
  lua: "Lua",
  markdown: "Markdown",
  md: "Markdown",
  mdx: "MDX",
  php: "PHP",
  plaintext: "Plain text",
  text: "Plain text",
  txt: "Plain text",
  python: "Python",
  py: "Python",
  ruby: "Ruby",
  rb: "Ruby",
  rust: "Rust",
  rs: "Rust",
  sql: "SQL",
  swift: "Swift",
  toml: "TOML",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  vue: "Vue",
  xml: "XML",
  yaml: "YAML",
  yml: "YAML",
};

export function formatCodeLangLabel(raw: string | null | undefined): string {
  if (!raw?.trim()) return "Plain text";
  const key = raw.trim().toLowerCase();
  const mapped = LANG_LABELS[key];
  if (mapped) return mapped;
  if (key.length <= 4 && /^[a-z0-9+#-]+$/.test(key)) return key.toUpperCase();
  return key.charAt(0).toUpperCase() + key.slice(1);
}

/** Sets `data-lang-label` on prose code blocks for the terminal title bar. */
export function initTerminalCodeLang(root: ParentNode = document): void {
  root
    .querySelectorAll<HTMLPreElement>(
      ".app-prose pre.astro-code[data-language]"
    )
    .forEach(pre => {
      const lang = pre.getAttribute("data-language");
      if (!lang || lang === "mermaid") {
        pre.removeAttribute("data-lang-label");
        return;
      }
      pre.setAttribute("data-lang-label", formatCodeLangLabel(lang));
    });
}

export function ensureTerminalCodeLangListener(): void {
  if (typeof window === "undefined") return;
  const run = () => initTerminalCodeLang();
  document.addEventListener("astro:page-load", run);
  const obs = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.attributeName === "data-theme") {
        run();
        break;
      }
    }
  });
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
}
