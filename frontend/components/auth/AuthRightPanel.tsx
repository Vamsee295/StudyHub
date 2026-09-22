import { ReactNode } from "react";

export function AuthRightPanel({ children }: { children: ReactNode }) {
  return (
    <section className="w-full lg:w-[52%] relative flex flex-col justify-center items-center p-5 sm:p-12 lg:p-16 bg-white flex-1 min-h-screen">
      <div className="absolute inset-0 opacity-40 pointer-events-none auth-dots-light" />
      <div className="w-full max-w-[440px] relative z-10">{children}</div>
    </section>
  );
}
