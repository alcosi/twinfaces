import { cn } from "@/shared/libs";

type StepsProgressBarProps<T extends string> = {
  steps: T[];
  current: T;
  containerClassName?: string | string[];
};

export function StepsProgressBar<T extends string>({
  steps,
  current,
  containerClassName,
}: StepsProgressBarProps<T>) {
  return (
    <div className={cn("flex gap-4", containerClassName)}>
      {steps.map((stepKey) => (
        <div
          key={stepKey}
          className={cn(
            "bg-muted h-2 w-full rounded",
            stepKey === current && "bg-primary"
          )}
        />
      ))}
    </div>
  );
}
