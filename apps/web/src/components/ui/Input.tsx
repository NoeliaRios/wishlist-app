import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="label">{label}</label>
      )}
      <input
        className={`
          w-full neo-border bg-gray-50 focus:bg-white
          px-3 py-2.5 text-sm font-bold
          placeholder:text-content-muted
          outline-none focus:ring-2 focus:ring-black
          ${className}
        `}
        {...props}
      />
    </div>
  );
}