// One Monaco theme for every editor in the app. Code is a dark "island" in both Paper and Dark themes
// (same as lesson code blocks), so its colours are fixed: night background, paper text, rust keywords, teal strings.
import type { BeforeMount } from "@monaco-editor/react";

export const MONACO_THEME = "studyhub-ink";

/** Pass as `beforeMount` on <Editor>, with theme={MONACO_THEME}. Safe to call for every editor. */
export const defineMonacoTheme: BeforeMount = (monaco) => {
  monaco.editor.defineTheme(MONACO_THEME, {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8a8178", fontStyle: "italic" },
      { token: "keyword", foreground: "e07a52" },
      { token: "string", foreground: "7fc4bc" },
      { token: "number", foreground: "e3a72f" },
      { token: "type", foreground: "f0c38a" },
      { token: "delimiter", foreground: "b8afa4" },
    ],
    colors: {
      "editor.background": "#151311",
      "editor.foreground": "#f5efe6",
      "editorLineNumber.foreground": "#5c554e",
      "editorLineNumber.activeForeground": "#f5efe6",
      "editor.lineHighlightBackground": "#1f1c19",
      "editor.selectionBackground": "#4a3a2f",
      "editorCursor.foreground": "#e07a52",
      "editorIndentGuide.background1": "#2a2622",
      "editorWidget.background": "#1c1a18",
      "editorSuggestWidget.background": "#1c1a18",
      "editorSuggestWidget.selectedBackground": "#2b2621",
    },
  });
};
