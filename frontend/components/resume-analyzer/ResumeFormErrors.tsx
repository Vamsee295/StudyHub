"use client";


interface ResumeFormErrorsProps {
  errors: Record<string, string>;
  apiError?: string | null;
  errorRef?: React.RefObject<HTMLDivElement | null>;
}

export function ResumeFormErrors({ errors, apiError, errorRef }: ResumeFormErrorsProps) {
  const fieldErrors = Object.entries(errors);
  if (fieldErrors.length === 0 && !apiError) return null;

  return (
    <div
      ref={errorRef}
      role="alert"
      tabIndex={-1}
      className="rounded-md border border-danger-line bg-danger-soft p-4"
    >
      <p className="text-[13px] font-semibold text-danger">
        {fieldErrors.length > 0 ? "Check the highlighted fields before continuing." : apiError ?? "Something went wrong."}
      </p>
      {fieldErrors.length > 0 && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[12.5px] leading-relaxed text-body">
          {fieldErrors.map(([field, message]) => (
            <li key={field}>
              <a href={`#${field}`} className="font-medium text-danger hover:underline">
                {message}
              </a>
            </li>
          ))}
        </ul>
      )}
      {apiError && fieldErrors.length > 0 && (
        <p className="mt-2 text-[12.5px] leading-relaxed text-body">{apiError}</p>
      )}
    </div>
  );
}
