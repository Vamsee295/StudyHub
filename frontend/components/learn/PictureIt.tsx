import { Eye } from "lucide-react";
import type { LessonVisual } from "@/lib/data/visuals/types";
import { Diagram, Figure } from "./Diagram";
import { LessonHeading, prose } from "./TheoryNotes";

/** The lesson's idea in plain words with a picture, shown before the theory so beginners get the shape first. */
export function PictureIt({ visual }: { visual: LessonVisual }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border-[1.5px] border-hair bg-card p-5 md:p-6">
      <LessonHeading icon={Eye}>Picture it</LessonHeading>
      <p className={prose.p}>{visual.plain}</p>
      {visual.diagram && <Diagram code={visual.diagram} caption={visual.caption} />}
      {visual.image && <Figure {...visual.image} caption={visual.caption} />}
    </section>
  );
}
