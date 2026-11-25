import { QuestionWeight } from "@/types";

/** Topics this company's rounds tend to cover. */
export function QuestionWeighting({ weights }: { weights: QuestionWeight[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="label-cond text-[20px]">Topics that come up</h3>
      <ul className="flex flex-wrap gap-2">
        {weights.map((w) => (
          <li key={w.topic} className="rounded-full border-[1.5px] border-hair bg-paper px-3 py-1 text-[13px] font-medium">
            {w.topic}
          </li>
        ))}
      </ul>
    </div>
  );
}
