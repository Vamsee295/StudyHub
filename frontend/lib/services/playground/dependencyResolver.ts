/**
 * StudyHub Web IDE — Dependency Resolver & Preview Builder
 *
 * Builds a self-contained preview document from the virtual file system.
 * Resolves <link href="./css/main.css">, <script src="./js/main.js">,
 * and ES module imports by inlining content from the VFS.
 *
 * Returns a Blob URL for the sandboxed iframe.
 */

import type { ProjectFile } from "@/types/playground";

// ── Utility ────────────────────────────────────────────────────────────────────

function normalizePath(p: string): string {
  return p.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
}

function resolveRelative(base: string, rel: string): string {
  if (rel.startsWith("./")) rel = rel.slice(2);
  if (rel.startsWith("../")) {
    const baseParts = normalizePath(base).split("/");
    baseParts.pop(); // remove filename
    const relParts = rel.split("/");
    while (relParts[0] === "..") {
      relParts.shift();
      baseParts.pop();
    }
    return [...baseParts, ...relParts].join("/");
  }
  const baseParts = normalizePath(base).split("/");
  baseParts.pop();
  return [...baseParts, ...normalizePath(rel).split("/")].filter(Boolean).join("/");
}

function findFile(files: ProjectFile[], path: string): ProjectFile | undefined {
  const norm = normalizePath(path);
  return files.find((f) => normalizePath(f.path) === norm);
}

// ── Console interceptor injected into the iframe ───────────────────────────────

const CONSOLE_INTERCEPTOR = `
<script>
(function() {
  var _methods = ["log", "info", "warn", "error"];
  _methods.forEach(function(method) {
    var orig = console[method].bind(console);
    console[method] = function() {
      var args = Array.prototype.slice.call(arguments);
      var msg = args.map(function(a) {
        try {
          if (typeof a === "object") return JSON.stringify(a, null, 2);
          return String(a);
        } catch(e) { return String(a); }
      }).join(" ");
      try {
        window.parent.postMessage({ type: "console", level: method, message: msg }, "*");
      } catch(e) {}
      orig.apply(console, arguments);
    };
  });
  window.addEventListener("error", function(e) {
    try {
      window.parent.postMessage({
        type: "console",
        level: "error",
        message: e.message + (e.filename ? " (" + e.filename + ":" + e.lineno + ")" : ""),
      }, "*");
    } catch(_) {}
  });
  window.addEventListener("unhandledrejection", function(e) {
    try {
      window.parent.postMessage({
        type: "console",
        level: "error",
        message: "Unhandled Promise Rejection: " + (e.reason ? String(e.reason) : "Unknown"),
      }, "*");
    } catch(_) {}
  });
})();
<\/script>`;

// ── ES module bundler (inline transform) ──────────────────────────────────────

/**
 * Recursively bundles an entry JS file and all its relative imports
 * into a single inlined module Blob URL chain, or returns a simple
 * bundled script if no imports are detected.
 */
function bundleJSEntry(
  entryPath: string,
  files: ProjectFile[],
  visited = new Set<string>()
): string {
  const norm = normalizePath(entryPath);
  if (visited.has(norm)) return "";
  visited.add(norm);

  const file = findFile(files, norm);
  if (!file) return `/* File not found: ${norm} */`;

  let content = file.content;

  // Replace relative imports with Blob URL equivalents
  // Pattern: import ... from "./something.js" or import "./something.js"
  const importRegex = /import\s+((?:.|\n)*?)\s+from\s+['"](\.[^'"]+)['"]/g;
  const sideEffectRegex = /import\s+['"](\.[^'"]+)['"]/g;

  const blobMap = new Map<string, string>();

  // Pre-process to collect all unique dependencies
  const deps = new Set<string>();
  let m: RegExpExecArray | null;

  const tmpContent = content;
  const tmpRegex = /import\s+(?:(?:.|\n)*?)\s+from\s+['"](\.[^'"]+)['"]/g;
  while ((m = tmpRegex.exec(tmpContent)) !== null) {
    deps.add(resolveRelative(norm, m[1]));
  }
  const tmpRegex2 = /import\s+['"](\.[^'"]+)['"]/g;
  while ((m = tmpRegex2.exec(tmpContent)) !== null) {
    deps.add(resolveRelative(norm, m[1]));
  }

  // Bundle each dep into a Blob URL
  for (const dep of deps) {
    const bundled = bundleJSEntry(dep, files, visited);
    const blob = new Blob([bundled], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    blobMap.set(dep, url);
  }

  // Replace import paths with Blob URLs
  content = content.replace(
    /import\s+((?:[^'"]*?))\s+from\s+['"](\.[^'"]+)['"]/g,
    (_, specifier, relPath) => {
      const absPath = resolveRelative(norm, relPath);
      const url = blobMap.get(absPath) ?? relPath;
      return `import ${specifier} from "${url}"`;
    }
  );

  content = content.replace(/import\s+['"](\.[^'"]+)['"]/g, (_, relPath) => {
    const absPath = resolveRelative(norm, relPath);
    const url = blobMap.get(absPath) ?? relPath;
    return `import "${url}"`;
  });

  return content;
}

// ── Preview Document Builder ───────────────────────────────────────────────────

export interface PreviewBuildResult {
  blobUrl: string;
  warnings: string[];
}

export function buildPreviewDocument(files: ProjectFile[]): PreviewBuildResult {
  const warnings: string[] = [];

  // Find the entry point: index.html at root
  const indexHtml = findFile(files, "index.html");

  if (!indexHtml) {
    // If no index.html, look for any .html file
    const anyHtml = files.find((f) => f.language === "html");
    if (!anyHtml) {
      const doc =
        "<!DOCTYPE html><html><head><meta charset=UTF-8></head><body>" +
        "<h2 style='font-family:sans-serif;color:#64748b;padding:40px'>" +
        "No index.html found in project</h2></body></html>";
      const blob = new Blob([doc], { type: "text/html" });
      return { blobUrl: URL.createObjectURL(blob), warnings: ["No index.html found"] };
    }
    return buildFromHtmlFile(anyHtml, files, warnings);
  }

  return buildFromHtmlFile(indexHtml, files, warnings);
}

function buildFromHtmlFile(
  htmlFile: ProjectFile,
  files: ProjectFile[],
  warnings: string[]
): PreviewBuildResult {
  let html = htmlFile.content;

  // 1. Resolve <link rel="stylesheet" href="..."> → inline <style>
  html = html.replace(
    /<link\s[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*\/?>/gi,
    (tag, href) => {
      if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) {
        return tag; // external, keep as-is
      }
      const resolved = resolveRelative(htmlFile.path, href);
      const cssFile = findFile(files, resolved);
      if (!cssFile) {
        warnings.push(`CSS file not found: ${href}`);
        return `<!-- CSS not found: ${href} -->`;
      }
      return `<style>\n${cssFile.content}\n</style>`;
    }
  );

  // Also resolve <link href="..." rel="..."> (different order)
  html = html.replace(
    /<link\s[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*\/?>/gi,
    (tag, href) => {
      if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) {
        return tag;
      }
      const resolved = resolveRelative(htmlFile.path, href);
      const cssFile = findFile(files, resolved);
      if (!cssFile) {
        warnings.push(`CSS file not found: ${href}`);
        return `<!-- CSS not found: ${href} -->`;
      }
      return `<style>\n${cssFile.content}\n</style>`;
    }
  );

  // 2. Resolve <script src="..."> → inline or module blob
  html = html.replace(
    /<script\s([^>]*)src=["']([^"']+)["']([^>]*)><\/script>/gi,
    (tag, before, src, after) => {
      if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//")) {
        return tag; // external CDN, keep
      }
      const resolved = resolveRelative(htmlFile.path, src);
      const jsFile = findFile(files, resolved);
      if (!jsFile) {
        warnings.push(`JS file not found: ${src}`);
        return `<!-- Script not found: ${src} -->`;
      }

      const isModule = (before + after).includes("module");

      if (isModule) {
        // Bundle ES module with imports resolved
        const bundled = bundleJSEntry(resolved, files);
        const safeContent = bundled.replace(/<\/script>/gi, "<\\/script>");
        return `<script type="module">\n${safeContent}\n<\/script>`;
      } else {
        const safeContent = jsFile.content.replace(/<\/script>/gi, "<\\/script>");
        return `<script>\n${safeContent}\n<\/script>`;
      }
    }
  );

  // 3. Inject console interceptor before </head> or at start of <body>
  if (html.toLowerCase().includes("</head>")) {
    html = html.replace(/<\/head>/i, CONSOLE_INTERCEPTOR + "\n</head>");
  } else if (html.toLowerCase().includes("<body")) {
    html = html.replace(/<body[^>]*>/i, (m) => m + "\n" + CONSOLE_INTERCEPTOR);
  } else {
    html = CONSOLE_INTERCEPTOR + "\n" + html;
  }

  const blob = new Blob([html], { type: "text/html" });
  return { blobUrl: URL.createObjectURL(blob), warnings };
}
