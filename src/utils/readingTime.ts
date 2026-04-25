import { readFileSync } from "node:fs";
import type { CollectionEntry } from "astro:content";

/** Strip leading YAML frontmatter from a markdown file. */
export const stripYamlFrontmatter = (raw: string): string => {
  if (!raw.startsWith("---")) return raw;
  const m = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  return m ? raw.slice(m[0].length) : raw;
};

/**
 * Rough reading time for mixed CJK + Latin markdown (code blocks de-emphasized).
 * CJK ~450 chars/min, English words ~200/min.
 */
export const estimateReadingMinutesFromMarkdown = (
  markdown: string
): number => {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/`[^`\n]+`/g, " ");

  const cjk = (
    text.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufa6f]/g) ?? []
  ).length;
  const withoutCjk = text.replace(
    /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufa6f]/g,
    " "
  );
  const latinWords = withoutCjk
    .trim()
    .split(/\s+/)
    .filter(w => /[A-Za-z0-9]/.test(w)).length;

  const minutes = cjk / 450 + latinWords / 200;
  return Math.max(1, Math.round(minutes));
};

export const getReadingMinutesForBlogEntry = (
  entry: Pick<CollectionEntry<"blog">, "collection" | "filePath">
): number | null => {
  if (entry.collection !== "blog" || !entry.filePath) return null;
  try {
    const raw = readFileSync(entry.filePath, "utf-8");
    return estimateReadingMinutesFromMarkdown(stripYamlFrontmatter(raw));
  } catch {
    return null;
  }
};
