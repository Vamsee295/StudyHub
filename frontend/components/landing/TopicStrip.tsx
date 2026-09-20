"use client";

const topics = [
  "DSA", "Java", "Python", "SQL", "DBMS", "OS",
  "Computer Networks", "Aptitude", "System Design", "AI / ML",
];

export function TopicStrip() {
  return (
    <section className="border-b border-border bg-white">
      <div className="container-max px-5 md:px-8 py-5">
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {topics.map((t) => (
            <a
              key={t}
              href="#resources"
              className="shrink-0 border border-border rounded-full px-4 py-2 text-[13.5px] text-ink-secondary hover:border-accent hover:text-accent transition-colors whitespace-nowrap"
            >
              {t}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
