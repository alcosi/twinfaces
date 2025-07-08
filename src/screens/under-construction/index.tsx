import { Construction } from "lucide-react";

export function UnderConstructionScreen() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-200">
        Page Under Construction
      </h1>
      <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
        We&apos;re working hard to bring this page to life. Please check back
        later!
      </p>
      <div className="flex items-center justify-center">
        <Construction className="h-32 w-32" />
      </div>
    </div>
  );
}
