export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="display text-[44px] sm:text-[52px]">{title}</h2>
      <p className="mt-2 text-[15px] text-body">{subtitle}</p>
    </div>
  );
}
