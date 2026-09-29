/**
 * StudyHub Web IDE — ZIP Exporter
 *
 * Generates a downloadable ZIP of the entire virtual project.
 * Also handles file upload / import into the VFS.
 */

import JSZip from "jszip";
import type { ProjectFile, ProjectFolder } from "@/types/playground";

export async function exportProjectAsZip(
  projectName: string,
  files: ProjectFile[],
  _folders: ProjectFolder[]
): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder(projectName.replace(/\s+/g, "-").toLowerCase()) ?? zip;

  for (const file of files) {
    // Create the full path inside the zip
    const parts = file.path.split("/");
    const filename = parts.pop()!;

    let parent: JSZip = rootFolder;
    for (const part of parts) {
      parent = parent.folder(part) ?? parent;
    }

    parent.file(filename, file.content);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = (projectName.replace(/\s+/g, "-").toLowerCase() || "project") + ".zip";
  a.click();

  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export async function downloadSingleFile(file: ProjectFile): Promise<void> {
  const blob = new Blob([file.content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();

  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function isSafeFileType(filename: string): boolean {
  const safe = [
    ".html", ".htm", ".css", ".js", ".mjs", ".ts", ".tsx",
    ".json", ".md", ".txt", ".svg", ".xml",
  ];
  const ext = "." + filename.split(".").pop()?.toLowerCase();
  return safe.includes(ext);
}

export async function readUploadedFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) ?? "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
