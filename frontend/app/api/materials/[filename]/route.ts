import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { RESOURCE_CATALOG } from "@/lib/resources";

function findPdfInMaterials(materialsDir: string, targetFilename: string): string | null {
  // 1. Direct check in root materials directory
  const directPath = path.join(materialsDir, targetFilename);
  if (fs.existsSync(directPath) && fs.statSync(directPath).isFile()) {
    return directPath;
  }

  // 2. Scan subdirectories (DBMS, DSA, Java, Javascript, Python, SQL, etc.)
  try {
    const entries = fs.readdirSync(materialsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subDir = path.join(materialsDir, entry.name);
        const subPath = path.join(subDir, targetFilename);
        if (fs.existsSync(subPath) && fs.statSync(subPath).isFile()) {
          return subPath;
        }

        // Case-insensitive search in subdirectory
        const subFiles = fs.readdirSync(subDir);
        for (const subFile of subFiles) {
          if (subFile.toLowerCase() === targetFilename.toLowerCase()) {
            return path.join(subDir, subFile);
          }
        }
      } else if (entry.isFile() && entry.name.toLowerCase() === targetFilename.toLowerCase()) {
        return path.join(materialsDir, entry.name);
      }
    }
  } catch (err) {
    console.error("[Materials API] Error scanning materials directory:", err);
  }

  return null;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename: rawFilename } = await context.params;
    const decodedFilename = decodeURIComponent(rawFilename);

    // Whitelist check against known resource catalog or valid .pdf request
    const allowedInCatalog = RESOURCE_CATALOG.some(
      (r) => r.filename.toLowerCase() === decodedFilename.toLowerCase()
    );

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

