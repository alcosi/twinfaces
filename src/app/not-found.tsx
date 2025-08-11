import { AlertTriangle } from "lucide-react";

export default function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-200">
        404 - Not Found
      </h1>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
        Sorry, the page you are looking for doesn&apos;t exist or has been
        moved.
      </p>
      <div className="flex items-center justify-center">
        <AlertTriangle className="text-link-enabled h-32 w-32" />
      </div>
    </div>
  );
}
