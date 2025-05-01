import { Construction } from "lucide-react";

export function UnderConstructionScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Page Under Construction
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
        We&apos;re working hard to bring this page to life. Please check back
        later!
      </p>
      <div className="flex items-center justify-center">
        <Construction className="w-32 h-32" />
      </div>
    </div>
  );
}
