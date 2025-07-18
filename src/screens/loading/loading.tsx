import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Loader2 className="text-primary h-10 w-10 animate-spin" />
    </div>
  );
}
