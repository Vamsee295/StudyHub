import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Recursively searches materials directory for a PDF matching the given filename.
 * Supports exact match, case-insensitive match, and trimmed comparison.
 */
function findPdfInMaterials(materialsDir: string, targetFilename: string): string | null {
  if (!fs.existsSync(materialsDir)) {
    return null;
  }

  // 1. Direct check in root materials directory
  const directPath = path.join(materialsDir, targetFilename);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    return directPath;
  }

  const normalizedTarget = targetFilename.toLowerCase().trim();

  // 2. Recursive search
  function searchDir(currentDir: string): string | null {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      // First check files in current directory
      for (const entry of entries) {
        if (entry.isFile()) {
          if (entry.name === targetFilename || entry.name.toLowerCase().trim() === normalizedTarget) {
            return path.join(currentDir, entry.name);
          }
        }
      }

      // Then recurse into subdirectories
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const match = searchDir(path.join(currentDir, entry.name));
          if (match) return match;
        }
      }
    } catch (err) {
      console.error(`[Materials API] Error reading directory ${currentDir}:`, err);
    }
    return null;
  }

  return searchDir(materialsDir);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename: rawFilename } = await context.params;
    const decodedFilename = decodeURIComponent(rawFilename);

    // Resolve path to frontend/materials
    const materialsDir = path.join(process.cwd(), "materials");
    const filePath = findPdfInMaterials(materialsDir, decodedFilename);

    if (!filePath) {
      console.warn(`[Materials API] File not found: "${decodedFilename}" in ${materialsDir}`);
      return new NextResponse("PDF file not found on disk.", { status: 404 });
    }

    // Security check: Ensure resolved path is strictly within materials directory
    const resolvedPath = path.resolve(filePath);
    const resolvedMaterialsDir = path.resolve(materialsDir);
    if (!resolvedPath.startsWith(resolvedMaterialsDir)) {
      return new NextResponse("Invalid file path.", { status: 400 });
    }

    const fileBuffer = await fs.promises.readFile(resolvedPath);
    const fileStat = await fs.promises.stat(resolvedPath);

    const isDownload = request.nextUrl.searchParams.get("download") === "true";
    const dispositionType = isDownload ? "attachment" : "inline";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": fileStat.size.toString(),
        "Content-Disposition": `${dispositionType}; filename="${encodeURIComponent(path.basename(resolvedPath))}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("[Materials API] Error streaming PDF:", error);
    return new NextResponse("Internal Server Error loading material.", { status: 500 });
  }
}
