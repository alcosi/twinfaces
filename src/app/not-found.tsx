import { AlertTriangle } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        404 - Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Sorry, the page you are looking for doesn&apos;t exist or has been
        moved.
      </p>
      <div className="flex items-center justify-center">
        <AlertTriangle className="w-32 h-32 text-link-dark-active" />
      </div>
    </div>
  );
}
