import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-16 h-16 animate-spin" />
    </div>
  );
}
