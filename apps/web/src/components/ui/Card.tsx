import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  color?: string;
}

export function Card({ children, className = "", onClick, color = "bg-surface-card" }: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        ${color} neo-border-lg neo-shadow-lg p-5
        ${onClick ? "cursor-pointer neo-interactive" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}