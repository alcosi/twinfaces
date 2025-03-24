import { Construction } from "lucide-react";

export function UnderConstructionScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4 text-gray-700">
        Page Under Construction
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        We&apos;re working hard to bring this page to life. Please check back
        later!
      </p>
      <div className="flex items-center justify-center">
        <Construction className="w-32 h-32" />
      </div>
    </div>
  );
}
