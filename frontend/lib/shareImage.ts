// Capture a DOM element as a PNG for sharing. html-to-image is loaded on demand.
//
// By default html-to-image scans every stylesheet for web fonts and downloads all of them, including
// every language subset and cross-origin sheets it isn't allowed to read (Monaco's CDN CSS). That made a
// capture take ~30 s and log errors. Instead we embed only our own same-origin @font-face rules for the
// Latin subset, once, and reuse that CSS for every capture.

let fontCSS: Promise<string> | null = null;

// Copying all ~400 computed properties onto every cloned element cost about 25 ms per element
// (17 s for this page). These are the ones that change how the page looks.
const SIDES = ["top", "right", "bottom", "left"];
const STYLE_PROPS = [
  "display", "position", "inset", ...SIDES, "z-index", "box-sizing", "float", "visibility", "opacity",
  "width", "height", "min-width", "min-height", "max-width", "max-height",
  ...SIDES.flatMap((s) => [`margin-${s}`, `padding-${s}`, `border-${s}-width`, `border-${s}-style`, `border-${s}-color`]),
  "border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius",
  "outline-width", "outline-style", "outline-color", "outline-offset", "box-shadow",
  "flex-direction", "flex-wrap", "flex-grow", "flex-shrink", "flex-basis", "align-items", "align-content", "align-self",
  "justify-content", "justify-items", "justify-self", "order", "row-gap", "column-gap",
  "grid-template-columns", "grid-template-rows", "grid-auto-flow", "grid-auto-columns", "grid-auto-rows",
  "grid-column-start", "grid-column-end", "grid-row-start", "grid-row-end",
  "overflow-x", "overflow-y", "text-overflow", "white-space", "word-break", "overflow-wrap",
  "color", "background-color", "background-image", "background-size", "background-position", "background-repeat", "background-clip",
  "font-family", "font-size", "font-weight", "font-style", "font-variant-numeric", "font-feature-settings",
  "line-height", "letter-spacing", "text-align", "text-transform", "text-decoration-line", "text-decoration-color", "vertical-align",
  "transform", "transform-origin", "rotate", "scale", "translate",
  "list-style-type", "object-fit", "fill", "stroke", "stroke-width", "fill-opacity", "stroke-opacity", "tab-size",
  "scrollbar-width", "scrollbar-color",
];

const toDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

async function buildFontCSS(): Promise<string> {
  const rules: CSSFontFaceRule[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    if (sheet.href && new URL(sheet.href).origin !== location.origin) continue; // can't read, don't need
    let list: CSSRuleList;
    try {
      list = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of Array.from(list)) {
      if (!(rule instanceof CSSFontFaceRule)) continue;
      if (rule.style.getPropertyValue("font-family").includes("__nextjs")) continue; // dev overlay fonts
      const range = rule.style.getPropertyValue("unicode-range");
      // keep the basic Latin subset (or rules without a range); skip Cyrillic, Greek, Vietnamese, …
      // Browsers normalise "U+0000-00FF" to "U+0-FF", so accept any zero padding.
      if (!range || /U\+0+-0*FF(?![0-9A-F])/i.test(range)) rules.push(rule);
    }
  }
  const parts = await Promise.all(
    rules.map(async (rule) => {
      let css = rule.cssText;
      const urls = [...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1]);
      for (const u of urls) {
        try {
          const abs = new URL(u, rule.parentStyleSheet?.href ?? location.href).href;
          const data = await toDataUrl(await (await fetch(abs)).blob());
          css = css.split(u).join(data);
        } catch {
          /* leave the url; that font just falls back */
        }
      }
      return css;
    })
  );
  return parts.join("\n");
}

/** Start embedding fonts in the background so the first Share click only has to capture. */
export function warmShareFonts() {
  fontCSS ??= buildFontCSS();
}

/** PNG of `node` at 2× resolution. Elements with `data-share-exclude` are left out. */
export async function captureElement(node: HTMLElement): Promise<Blob> {
  const [{ toBlob }, css] = await Promise.all([import("html-to-image"), (fontCSS ??= buildFontCSS())]);
  const blob = await toBlob(node, {
    pixelRatio: 2,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
    fontEmbedCSS: css,
    includeStyleProperties: STYLE_PROPS,
    filter: (el) => !(el instanceof HTMLElement && el.dataset.shareExclude !== undefined),
  });
  if (!blob) throw new Error("Could not capture the page");
  return blob;
}
