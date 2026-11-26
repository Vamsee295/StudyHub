import Link from "next/link";
import { ArrowRight, ExternalLink, Terminal } from "lucide-react";
import type { CompanyWorkspaceDetail } from "@/types";
import { buttonClass } from "@/components/ui/Button";
import type { CompanyEntry } from "@/lib/data/companyData";
import { HiringPipeline } from "./HiringPipeline";
import { CompanyPrepPlan } from "./CompanyPrepPlan";
import { CompanyQuestions } from "./CompanyQuestions";
import { CompanyLogo } from "./CompanyLogo";
import { OpenRoles } from "./OpenRoles";

/** One company: who they are, what's open now, how they hire, and the questions they're reported to ask. */
export function CompanyWorkspace({ company, curated }: { company: CompanyEntry; curated?: CompanyWorkspaceDetail }) {
  const f = company.facts;
  const facts = [
    f.founded && { k: "Founded", v: f.founded },
    f.hq && { k: "Headquarters", v: f.hq },
    f.employees && { k: "Employees", v: `${f.employees.toLocaleString()}${f.employeesYear ? ` (${f.employeesYear})` : ""}` },
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <div className="flex min-w-0 flex-col gap-8 rounded-2xl border-[1.5px] border-hair bg-card p-5 md:p-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div className="flex min-w-0 gap-4">
          <CompanyLogo company={company} size={64} />
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="display text-[30px]">{company.name}</h2>
              <span className="rounded border-[1.5px] border-hair bg-paper-2 px-2 py-1 text-[11px] font-semibold text-body">{company.segment}</span>
            </div>
            {curated && <p className="text-[13px] font-medium text-body">Hires freshers as {curated.targetRole} · {curated.locations.join(", ")}</p>}
            {facts.length > 0 && (
              <dl className="flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
                {facts.map((x) => (
                  <div key={x.k} className="flex gap-1.5">
                    <dt className="text-mute">{x.k}</dt>
                    <dd className="font-medium text-ink">{x.v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <a href={company.careers} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "sm")}>
            Careers <ExternalLink className="size-3.5" />
          </a>
          <Link href="/tools/interview-simulator" className={`${buttonClass("secondary", "sm")} max-sm:hidden`}>
            <Terminal className="size-4" /> Mock interview
          </Link>
          {curated && (
            <Link href={`/tools/company-prep?company=${company.id}`} className={buttonClass("primary", "sm")}>
              Prepare for {company.name} <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </div>

      {f.summary && (
        <p className="-mt-2 max-w-3xl text-[14.5px] leading-relaxed text-body">
          {f.summary}{" "}
          {f.wikipedia && (
            <a href={f.wikipedia} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-[12.5px] text-mute underline">
              Wikipedia
            </a>
          )}
        </p>
      )}

      {company.jobs && (
        <>
          <hr className="border-hair" />
          <OpenRoles company={{ ...company, jobs: company.jobs }} />
        </>
      )}

      <hr className="border-hair" />

      {curated ? (
        <>
          <HiringPipeline stages={curated.hiringStages} />
          <hr className="border-hair" />
          <CompanyPrepPlan workspace={curated} />
        </>
      ) : (
        <div className="flex flex-col gap-1.5">
          <h3 className="label-cond text-[20px]">How {company.name} hires</h3>
          <p className="max-w-3xl text-[14px] text-body">
            We haven&apos;t mapped {company.name}&apos;s rounds yet.{" "}
            {company.segment === "Service & IT"
              ? "Service companies usually start with an aptitude and coding test, then a technical interview on core CS and your project, then HR."
              : "Most companies like this start with an online coding test, then two or three interviews on data structures, problem solving and your projects, and end with a behavioural round."}{" "}
            <a href="#hiring-basics" className="text-accent-ink underline">
              What each round checks
            </a>
            . Their{" "}
            <a href={company.careers} target="_blank" rel="noopener noreferrer" className="text-accent-ink underline">
              careers page
            </a>{" "}
            lists current openings.
          </p>
        </div>
      )}

      <hr className="border-hair" />

      <CompanyQuestions company={company} />
    </div>
  );
}
