import { cn } from "@/lib/utils";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs tracking-widest text-neutral-400",
        className
      )}
    >
      {children}
    </span>
  );
}
