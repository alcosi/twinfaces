import { User } from "lucide-react";

export default function Page() {
  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
      <div className="border-border bg-card text-card-foreground w-full max-w-sm space-y-4 rounded-2xl border p-8 text-center shadow-lg">
        <div className="flex justify-center">
          <User />
        </div>
        <h1 className="text-2xl font-semibold">John Doe</h1>
        <p className="text-muted-foreground">Description</p>
      </div>
    </div>
  );
}
