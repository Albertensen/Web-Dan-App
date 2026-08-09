/**
 * Sanitizer HTML ringan utk output TipTap — tanpa dependency DOMPurify.
 * Whitelist tag + strip atribut berbahaya (on*, javascript:, style).
 */
const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s", "code", "pre",
  "ul", "ol", "li", "blockquote", "h1", "h2", "h3", "h4", "a",
]);

const ALLOWED_ATTRS = new Set(["href", "target", "rel"]);

export function sanitizeHtml(input: string): string {
  if (!input) return "";

  // 1) Buang script/style/iframe & event handler
  let out = input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");

  // 2) Hapus semua tag lain, sisakan whitelist
  out = out.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (full, tag: string, attrs: string) => {
    const t = tag.toLowerCase();
    if (!ALLOWED_TAGS.has(t)) return "";
    // parse atribut
    const kept: string[] = [];
    const attrRe = /([a-zA-Z-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g;
    let m: RegExpExecArray | null;
    while ((m = attrRe.exec(attrs)) !== null) {
      const name = m[1].toLowerCase();
      if (ALLOWED_ATTRS.has(name) && !/javascript:/i.test(m[2])) {
        kept.push(`${name}=${m[2]}`);
      }
    }
    const attrStr = kept.length ? " " + kept.join(" ") : "";
    if (full.startsWith("</")) return `</${t}>`;
    return `<${t}${attrStr}>`;
  });

  return out;
}
