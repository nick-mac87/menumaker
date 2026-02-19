"use client";

import { Badge } from "@/components/ui/badge";

interface ProBadgeProps {
  onClick?: () => void;
}

export default function ProBadge({ onClick }: ProBadgeProps) {
  return (
    <Badge
      className="bg-gradient-to-r from-violet-600 to-blue-600 border-transparent text-[10px] font-bold uppercase tracking-wider text-white cursor-pointer hover:opacity-90 transition-opacity"
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      PRO
    </Badge>
  );
}
