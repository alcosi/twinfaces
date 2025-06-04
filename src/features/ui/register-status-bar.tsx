import { cn } from "@/shared/libs";

export function RegisterStatusBar({ step }: { step: "register" | "confirm" }) {
  return (
    <div className="mt-6 flex items-center justify-center">
      <div className="flex gap-4">
        <div
          className={cn(
            "bg-muted h-2 w-32 rounded",
            step === "register" && "bg-primary"
          )}
        />
        <div
          className={cn(
            "bg-muted h-2 w-32 rounded",
            step === "confirm" && "bg-primary"
          )}
        />
      </div>
    </div>
  );
}
