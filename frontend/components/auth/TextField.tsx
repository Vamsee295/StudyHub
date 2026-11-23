"use client";

import { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, id, className, ...rest }: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs tag-mono font-medium text-ink-secondary mb-1.5">
        {label}
      </label>
      <input
        id={id}
        className={`field field-lg w-full !bg-white !text-slate-900 border border-slate-200 placeholder:text-slate-400 focus:!bg-white focus:border-accent focus:ring-2 focus:ring-accent/15 shadow-2xs transition-colors ${error ? "field-error" : ""} ${className ?? ""}`}
        {...rest}
      />
      {error && <p className="text-[12px] text-error mt-1.5">{error}</p>}
    </div>
  );
}
