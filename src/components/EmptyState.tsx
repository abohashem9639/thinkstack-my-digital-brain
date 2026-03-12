import { motion } from "framer-motion";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  message: string;
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col items-center justify-center p-12 text-center col-span-full h-[50vh]"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative h-28 w-28 rounded-3xl bg-secondary/50 border border-border/50 flex flex-col items-center justify-center shadow-2xl overflow-hidden glass">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground/90 max-w-sm leading-relaxed">{message}</h3>
    </motion.div>
  );
}
