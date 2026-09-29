import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const materialsDir = path.join(__dirname, "..", "materials");
const resourcesFile = path.join(__dirname, "..", "lib", "resources.ts");

function scanPdfs(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanPdfs(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
      const rel = path.relative(materialsDir, fullPath).replace(/\\/g, "/");
      const folder = path.dirname(rel);
      const stat = fs.statSync(fullPath);
      results.push({
        filename: entry.name,
        relPath: rel,
        folder: folder === "." ? "Root" : folder,
        sizeBytes: stat.size
      });
    }
  }
  return results;
}

const diskPdfs = scanPdfs(materialsDir);
console.log(`\n========================================`);
console.log(` STUDYHUB MATERIALS SCANNER REPORT`);
console.log(`========================================`);
console.log(`Total PDFs found on disk: ${diskPdfs.length}`);

const resourcesContent = fs.readFileSync(resourcesFile, "utf-8");
const filenameMatches = [...resourcesContent.matchAll(/filename:\s*["']([^"']+)["']/g)].map(m => m[1]);
const registeredSet = new Set(filenameMatches.map(f => f.toLowerCase()));

const newlyDetected = diskPdfs.filter(p => !registeredSet.has(p.filename.toLowerCase()));
const existing = diskPdfs.filter(p => registeredSet.has(p.filename.toLowerCase()));

// Category breakdown
const categoryCounts = {};
for (const p of diskPdfs) {
  categoryCounts[p.folder] = (categoryCounts[p.folder] || 0) + 1;
}

// Duplicates check
const nameCounts = {};
for (const p of diskPdfs) {
  nameCounts[p.filename.toLowerCase()] = (nameCounts[p.filename.toLowerCase()] || 0) + 1;
}
const duplicates = Object.entries(nameCounts).filter(([_, count]) => count > 1);

// Missing check
const diskFilenames = new Set(diskPdfs.map(p => p.filename.toLowerCase()));
const missing = filenameMatches.filter(f => !diskFilenames.has(f.toLowerCase()));

console.log(`Existing PDFs registered: ${existing.length}`);
console.log(`Newly detected PDFs: ${newlyDetected.length}`);
console.log(`\nCategories Breakdown:`);
for (const [cat, count] of Object.entries(categoryCounts).sort()) {
  console.log(`  - ${cat}: ${count} PDFs`);
}

console.log(`\nDuplicate Filenames: ${duplicates.length === 0 ? "None (0 duplicates)" : duplicates.join(", ")}`);
console.log(`Missing Files: ${missing.length === 0 ? "None (0 missing)" : missing.join(", ")}`);

if (newlyDetected.length > 0) {
  console.log(`\nNewly Detected Files:`);
  for (const item of newlyDetected) {
    console.log(`  + [${item.folder}] ${item.filename} (${(item.sizeBytes / (1024 * 1024)).toFixed(2)} MB)`);
  }
}
console.log(`========================================\n`);
