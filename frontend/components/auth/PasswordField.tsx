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
        <label htmlFor={id} className="block text-xs tag-mono font-medium text-ink-secondary">
          {label}
        </label>
        {forgotHref && (
          <a href={forgotHref} className="text-xs text-accent hover:text-accent-hover font-medium transition-colors">
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
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink p-1 transition-colors"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && <p className="text-[12px] text-error mt-1.5">{error}</p>}
    </div>
  );
}
