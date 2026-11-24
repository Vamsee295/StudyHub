"use client";
// In-app replacement for window.confirm (the browser's own box breaks the look). Ported from Mimo's Ask.tsx.
import { useEffect, useRef, useSyncExternalStore } from "react";
import { clsx } from "clsx";
import { buttonClass } from "./Button";

type Req = { title: string; body?: string; ok: string; danger?: boolean; done: (yes: boolean) => void };
let req: Req | null = null;
const listeners = new Set<() => void>();
const set = (r: Req | null) => {
  req = r;
  listeners.forEach((l) => l());
};

/** Yes/no question in a sticker dialog; resolves true only if confirmed. Needs <AskDialog /> mounted (AppLayout does). */
export const askConfirm = (title: string, { body, ok = "Confirm", danger = false }: { body?: string; ok?: string; danger?: boolean } = {}) =>
  new Promise<boolean>((done) => {
    req?.done(false); // a newer question replaces an open one
    set({ title, body, ok, danger, done });
  });

export function AskDialog() {
  const current = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => req,
    () => null
  );
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (current && !ref.current?.open) ref.current?.showModal();
  }, [current]);

  const finish = (yes: boolean) => {
    current?.done(yes);
    set(null);
    ref.current?.close();
  };

  return (
    <dialog
      ref={ref}
      onCancel={(e) => (e.preventDefault(), finish(false))}
      onClick={(e) => e.target === e.currentTarget && finish(false)}
      className="pop-in brut m-auto w-[min(92vw,400px)] rounded-2xl bg-card p-0 text-ink backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      {current && (
        <div className="p-6">
          <p className="display text-[28px]">{current.title}</p>
          {current.body && <p className="mt-2 text-[15px] leading-relaxed text-body">{current.body}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={() => finish(false)} className={buttonClass("ghost", "sm")}>
              Cancel
            </button>
            <button type="button" autoFocus onClick={() => finish(true)} className={clsx(buttonClass(current.danger ? "danger" : "primary", "sm"))}>
              {current.ok}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
