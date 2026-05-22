import type { Root as HastRoot } from "hast";
import type { Element, Text } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

function textFromHast(node: Element | Text): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") {
    return (node.children ?? [])
      .map(child => textFromHast(child as Element | Text))
      .join("");
  }
  return "";
}

function classListIncludes(
  className: Element["properties"]["className"],
  token: string
): boolean {
  if (!className) return false;
  const list = Array.isArray(className) ? className : [className];
  return list.some(
    cls => typeof cls === "string" && cls.split(/\s+/).includes(token)
  );
}

/** Reconstruct Mermaid source from Shiki <code> with <span class="line"> children. */
function definitionFromCodeEl(code: Element): string {
  const lineEls = (code.children ?? []).filter(
    (child): child is Element =>
      child.type === "element" &&
      child.tagName === "span" &&
      classListIncludes(child.properties?.className, "line")
  );
  if (lineEls.length > 0) {
    return lineEls.map(line => textFromHast(line)).join("\n").trim();
  }
  return textFromHast(code).trim();
}

function isMermaidPre(pre: Element): boolean {
  const lang = pre.properties?.dataLanguage ?? pre.properties?.["data-language"];
  if (lang === "mermaid") return true;
  const code = pre.children?.find(
    (child): child is Element =>
      child.type === "element" && child.tagName === "code"
  );
  return code ? classListIncludes(code.properties?.className, "language-mermaid") : false;
}

/**
 * After markdown parse: embed diagram source on mermaid fences for client render.
 */
export const rehypeMermaidSource: Plugin<[], HastRoot> = () => tree => {
  visit(tree, "element", node => {
    if (node.tagName !== "pre" || !isMermaidPre(node)) return;

    const code = node.children?.find(
      (child): child is Element =>
        child.type === "element" && child.tagName === "code"
    );
    if (!code) return;

    const definition = definitionFromCodeEl(code);
    if (!definition) return;

    node.properties = {
      ...node.properties,
      dataLanguage: "mermaid",
      dataMermaidSource: definition,
    };
  });
};

export default rehypeMermaidSource;
