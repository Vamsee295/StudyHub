import { clsx } from "clsx";

/** A person's photo, or their initials when they have none. */
export function Avatar({ src, name, className }: { src?: string | null; name: string; className?: string }) {
  const base = clsx("shrink-0 rounded-full border-2 border-line", className);
  // older profiles were saved with a shared cartoon placeholder: treat it as "no photo"
  if (src && !src.includes("api.dicebear.com")) {
    // Photos come from whichever host the account uses (Google, GitHub, Supabase storage…), which
    // next/image would need allow-listed one by one; a plain <img> works for any of them.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className={clsx(base, "bg-card object-cover")} />;
  }
  const initials = name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  return (
    <span aria-hidden className={clsx(base, "grid place-items-center bg-accent font-cond font-bold text-paper")}>
      {initials}
    </span>
  );
}
