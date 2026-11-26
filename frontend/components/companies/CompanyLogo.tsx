"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { logoUrl, monogram, type CompanyEntry } from "@/lib/data/companyData";

/** The company's logo from Wikimedia Commons on a white tile (logos assume white), or its initials. */
export function CompanyLogo({ company, size = 48 }: { company: Pick<CompanyEntry, "name" | "facts">; size?: number }) {
  const [failed, setFailed] = useState(false);
  const file = company.facts.logo;
  return (
    <span
      className={clsx("grid shrink-0 place-items-center overflow-hidden rounded-xl border-[1.5px] border-hair", file && !failed ? "bg-white p-1.5" : "bg-paper-2 font-cond font-bold text-ink")}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {file && !failed ? (
        // external Commons image at a fixed small width; a plain img works for any host
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl(file, size * 3)} alt="" loading="lazy" onError={() => setFailed(true)} className="max-h-full max-w-full object-contain" />
      ) : (
        monogram(company.name)
      )}
    </span>
  );
}
