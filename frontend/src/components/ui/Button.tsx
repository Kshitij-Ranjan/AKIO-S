import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils.js";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    let variantClass = "";
    if (variant === "primary") variantClass = "btn--primary";
    if (variant === "outline") variantClass = "btn--outline";
    if (variant === "ghost") variantClass = "btn--ghost";

    return (
      <button
        ref={ref}
        className={cn("btn", variantClass, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
