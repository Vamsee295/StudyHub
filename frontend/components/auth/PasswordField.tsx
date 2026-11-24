"use client";

import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  forgotHref?: string;
}

export function PasswordField({ label, error, forgotHref, id, className, ...rest }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="block font-mono text-[11px] uppercase tracking-wider text-mute">
          {label}
        </label>
        {forgotHref && (
          <a href={forgotHref} className="text-[13px] font-semibold text-accent-ink hover:underline">
            Forgot password?
          </a>
        )}
      </div>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={`field field-lg w-full pr-11 ${error ? "field-error" : ""} ${className ?? ""}`}
          {...rest}
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
          className="tap absolute right-3 top-1/2 -translate-y-1/2 p-1 text-mute hover:text-ink"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-[13px] text-danger">{error}</p>}
    </div>
  );
}
