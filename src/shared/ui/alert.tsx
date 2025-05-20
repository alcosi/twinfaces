import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/libs";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: `
          border-[color:var(--alert-success-border)]
          bg-[color:var(--alert-success-bg)]
          text-[color:var(--alert-success-text)]
        `,
        error: `
          border-[color:var(--alert-error-border)]
          bg-[color:var(--alert-error-bg)]
          text-[color:var(--alert-error-text)]
        `,
        warn: `
          border-[color:var(--alert-warn-border)]
          bg-[color:var(--alert-warn-bg)]
          text-[color:var(--alert-warn-text)]
        `,
        info: `
          border-[color:var(--alert-info-border)]
          bg-[color:var(--alert-info-bg)]
          text-[color:var(--alert-info-text)]
        `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 leading-none font-medium tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
