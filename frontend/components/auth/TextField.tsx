"use client";

import { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, id, className, ...rest }: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block font-mono text-[11px] uppercase tracking-wider text-mute mb-1.5">
        {label}
      </label>
      <input
        id={id}
        className={`field field-lg w-full ${error ? "field-error" : ""} ${className ?? ""}`}
        {...rest}
      />
      {error && <p className="mt-1.5 text-[13px] text-danger">{error}</p>}
    </div>
  );
}
