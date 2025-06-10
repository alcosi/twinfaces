import { Lock } from "lucide-react";

export function PermissionDeniedScreen() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-200">
        Page Access Denied
      </h1>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
        You don&apos;t have permission to view this page. Please contact you
        admin!
      </p>
      <div className="flex items-center justify-center">
        <Lock className="h-32 w-32" />
      </div>
    </div>
  );
}
