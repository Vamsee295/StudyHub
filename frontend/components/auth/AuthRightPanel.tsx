import { ReactNode } from "react";

export function AuthRightPanel({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-screen w-full flex-1 flex-col items-center justify-center bg-card p-5 sm:p-12 lg:w-[52%] lg:p-16">
      <div className="w-full max-w-[440px]">{children}</div>
    </section>
  );
}
