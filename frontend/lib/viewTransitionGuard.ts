// Browsers refuse a view transition while the tab is hidden. React ignores that refusal only when the
// message matches exactly, and some Chromium builds append text (". Document hidden"), so React reports
// it as an error. While hidden, skip the transition: apply the update directly and hand React the exact
// refusal it already ignores. Visible tabs are untouched.
const IGNORED = "Transition was aborted because of invalid state"; // the message React treats as harmless

type Update = (() => unknown) | { update?: () => unknown } | undefined;

export function guardViewTransitions() {
  if (typeof document === "undefined" || !document.startViewTransition) return;
  const doc = document as Document & { __vtGuarded?: boolean };
  if (doc.__vtGuarded) return;
  doc.__vtGuarded = true;

  const original = document.startViewTransition.bind(document);
  document.startViewTransition = ((arg?: Update) => {
    if (document.visibilityState !== "hidden") return original(arg as never);
    const update = typeof arg === "function" ? arg : arg?.update;
    const updateCallbackDone = Promise.resolve().then(() => update?.());
    const refused = updateCallbackDone.then(() => {
      throw new DOMException(IGNORED, "InvalidStateError");
    });
    refused.catch(() => {}); // React handles it; this only avoids an unhandled-rejection warning
    return {
      ready: refused,
      finished: updateCallbackDone.then(() => undefined),
      updateCallbackDone: updateCallbackDone.then(() => undefined),
      skipTransition() {},
      types: new Set<string>(),
    } as unknown as ViewTransition;
  }) as typeof document.startViewTransition;
}
