import { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  right,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  right?: ReactNode;
}) {
  if (align === "center") {
    return (
      <Reveal className="text-center mb-9 md:mb-10">
        <p className="tag-mono text-ink-tertiary mb-2 uppercase">{eyebrow}</p>
        <h2 className="font-display text-[26px] md:text-3xl font-medium tracking-tight text-ink">
          {title}
        </h2>
        {description && (
          <p className="text-ink-secondary text-[14.5px] mt-3 max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </Reveal>
    );
  }

  return (
    <Reveal className="flex items-end justify-between gap-4 flex-wrap mb-9 md:mb-10">
      <div>
        <p className="tag-mono text-ink-tertiary mb-2 uppercase">{eyebrow}</p>
        <h2 className="font-display text-[26px] md:text-3xl font-medium tracking-tight text-ink">
          {title}
        </h2>
        {description && (
          <p className="text-ink-secondary text-[14.5px] mt-2 max-w-md">{description}</p>
        )}
      </div>
      {right}
    </Reveal>
  );
}
