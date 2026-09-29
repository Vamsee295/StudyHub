import { NextResponse } from "next/server";
import path from "path";
import { getUnifiedCatalog } from "@/lib/materialsScanner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const materialsDir = path.join(process.cwd(), "materials");
    const catalogData = getUnifiedCatalog(materialsDir);

    // Calculate dynamic categories and counts
    const categoryCounts: Record<string, number> = {
      All: catalogData.resources.length
    };

    for (const res of catalogData.resources) {
      categoryCounts[res.category] = (categoryCounts[res.category] || 0) + 1;
    }

    const preferredOrder = ["All", "DSA", "Java", "JavaScript", "Network Protocols", "DBMS", "SQL", "Python"];
    const dynamicKeys = Object.keys(categoryCounts).filter(
      (k) => k !== "All" && !preferredOrder.includes(k)
    );
    const sortedCategories = [
      ...preferredOrder.filter((c) => categoryCounts[c] !== undefined),
      ...dynamicKeys.sort()
    ].map((name) => ({
      name,
      count: categoryCounts[name] || 0
    }));

    return NextResponse.json({
      success: true,
      total: catalogData.totalPdfs,
      existingCount: catalogData.existingCount,
      newCount: catalogData.newCount,
      newFiles: catalogData.newFiles,
      categories: sortedCategories,
      resources: catalogData.resources
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    });
  } catch (error: any) {
    console.error("[Materials Catalog API] Error generating catalog:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to scan materials" },
      { status: 500 }
    );
  }
}
