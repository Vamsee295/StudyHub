import fs from "fs";
import path from "path";
import { Resource, RESOURCE_CATALOG } from "@/lib/resources";

/**
 * Normalizes a folder name to a standardized StudyHub resource category.
 */
export function mapFolderToCategory(folderName: string): Resource["category"] {
  const normalized = folderName.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (normalized.includes("advancealgorithms") || normalized.includes("dsa") || normalized.includes("datastructure")) {
    return "DSA";
  }
  if (normalized.includes("java") && !normalized.includes("javascript")) {
    return "Java";
  }
  if (normalized.includes("sql")) {
    return "SQL";
  }
  if (normalized.includes("dbms") || normalized.includes("database")) {
    return "DBMS";
  }
  if (normalized.includes("network") || normalized.includes("security") || normalized.includes("nps") || normalized.includes("protocol")) {
    return "Network Protocols";
  }
  if (normalized.includes("python")) {
    return "Python";
  }
  if (normalized.includes("javascript") || normalized.includes("js") || normalized.includes("web") || normalized.includes("frontend") || normalized.includes("react")) {
    return "JavaScript";
  }
  if (normalized.includes("oop") || normalized.includes("objectoriented")) {
    return "Java";
  }

  // Fallback to formatted folder name or Other
  return folderName ? (folderName as any) : "Other";
}

/**
 * Generates a clean URL slug from a filename.
 */
export function generateSlugFromFilename(filename: string): string {
  return filename
    .replace(/\.pdf$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates a clean display title from a filename.
 */
export function generateTitleFromFilename(filename: string): string {
  const withoutExt = filename.replace(/\.pdf$/i, "");
  // Replace underscores and multiple dashes with spaces
  let cleaned = withoutExt.replace(/[_-]+/g, " ").trim();

  // If filename looks like AADS_CO1 -> "Advance Algorithms & Data Structures (CO1)"
  if (/^AADS[ _-]?CO[ -]?(\d+)$/i.test(cleaned)) {
    const match = cleaned.match(/^AADS[ _-]?CO[ -]?(\d+)$/i);
    return `Advance Algorithms & Data Structures — Unit ${match?.[1]} (CO${match?.[1]})`;
  }

  // Title case words
  return cleaned
    .split(/\s+/)
    .map(word => {
      const lower = word.toLowerCase();
      if (["and", "or", "in", "of", "the", "by", "for", "along"].includes(lower)) return lower;
      if (["dsa", "sql", "dbms", "nps", "jsp", "jdbc", "oop", "co1", "co2", "co3", "co4"].includes(lower)) return lower.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export interface DiscoveredFile {
  filename: string;
  relativePath: string;
  folder: string;
  absolutePath: string;
  sizeBytes: number;
}

/**
 * Recursively scans the materials directory to find all PDF files.
 */
export function scanMaterialsDirectory(materialsDir: string): DiscoveredFile[] {
  const discovered: DiscoveredFile[] = [];

  function walk(currentDir: string) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
        const rel = path.relative(materialsDir, fullPath);
        const folder = path.dirname(rel).replace(/\\/g, "/");
        const stat = fs.statSync(fullPath);
        discovered.push({
          filename: entry.name,
          relativePath: rel.replace(/\\/g, "/"),
          folder: folder === "." ? "Root" : folder,
          absolutePath: fullPath,
          sizeBytes: stat.size
        });
      }
    }
  }

  walk(materialsDir);
  return discovered;
}

/**
 * Builds the complete unified catalog by merging discovered disk files with curated metadata.
 * Any new PDF placed in frontend/materials/ is automatically discovered, categorized, and added.
 * Packs bundle multiple sub-files together without duplicating them.
 */
export function getUnifiedCatalog(materialsDir?: string): {
  resources: Resource[];
  totalPdfs: number;
  existingCount: number;
  newCount: number;
  newFiles: string[];
} {
  const dir = materialsDir || path.join(process.cwd(), "materials");
  const discovered = scanMaterialsDirectory(dir);

  // Set of filenames covered inside any pack
  const filesInPacks = new Set<string>();
  for (const item of RESOURCE_CATALOG) {
    if (item.isPack && item.packItems) {
      for (const sub of item.packItems) {
        filesInPacks.add(sub.filename.toLowerCase());
      }
    }
  }

  // Map known standalone curated items by filename
  const curatedByFilename = new Map<string, Resource>();
  for (const item of RESOURCE_CATALOG) {
    if (!item.isPack) {
      curatedByFilename.set(item.filename.toLowerCase(), item);
    }
  }

  const result: Resource[] = [];
  // 1. Add all curated packs first
  for (const item of RESOURCE_CATALOG) {
    if (item.isPack) {
      result.push(item);
    }
  }

  const newFiles: string[] = [];
  let existingCount = 0;
  let newCount = 0;

  for (const file of discovered) {
    const lowerFilename = file.filename.toLowerCase();

    // If it's already part of a pack, mark it as accounted for and do not create a duplicate card
    if (filesInPacks.has(lowerFilename)) {
      existingCount++;
      continue;
    }

    const existing = curatedByFilename.get(lowerFilename);
    if (existing) {
      result.push({
        ...existing,
        fileUrl: `/api/materials/${encodeURIComponent(file.filename)}`
      });
      existingCount++;
    } else {
      // Automatically construct Resource for newly detected standalone file
      const category = mapFolderToCategory(file.folder);
      const title = generateTitleFromFilename(file.filename);
      const slug = generateSlugFromFilename(file.filename);

      const newResource: Resource = {
        id: slug,
        title,
        description: `Comprehensive reference and preparation material for ${category}. Detailed concepts, diagrams, and revision notes.`,
        category,
        type: "PDF",
        filename: file.filename,
        fileUrl: `/api/materials/${encodeURIComponent(file.filename)}`,
        tags: [category, ...file.folder.split(/[-_/ ]+/).filter(Boolean)],
        difficulty: "Intermediate",
        author: "StudyHub Library",
        readTimeEstimate: `${Math.max(15, Math.min(180, Math.round(file.sizeBytes / (1024 * 150))))}m read`,
        featured: false
      };

      result.push(newResource);
      newFiles.push(file.filename);
      newCount++;
    }
  }

  return {
    resources: result,
    totalPdfs: discovered.length,
    existingCount,
    newCount,
    newFiles
  };
}
