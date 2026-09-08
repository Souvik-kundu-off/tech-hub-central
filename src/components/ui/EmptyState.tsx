import React from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title?: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div className={`w-full max-w-lg mx-auto border border-border/80 bg-card/60 backdrop-blur-sm rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center justify-center shadow-sm my-4 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-inner">
        <Icon className="w-6 h-6" />
      </div>
      {title && <h3 className="text-base font-bold mb-1.5 text-foreground">{title}</h3>}
      <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed mb-6">{description}</p>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
};

export default EmptyState;
