import { Alert, AlertDescription, AlertTitle, Button } from "@/shared/ui";
import { RefreshCcw } from "lucide-react";
import warningLogo from "../../public/images/warning.png";
import Image from "next/image";

export function ServerErrorAlert() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-[90vh] items-center justify-center p-4">
      <div className="max-w-md text-center">
        <Alert
          variant="destructive"
          className="flex flex-col items-center gap-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
        >
          <Image src={warningLogo.src} alt="error icon" width={100} />
          <AlertTitle className="text-2xl font-bold">
            Oops, something went wrong
          </AlertTitle>
          <AlertDescription>
            There was a problem connecting to the server. Please refresh the
            page or check your connection.
          </AlertDescription>
        </Alert>
        <Button
          onClick={handleRefresh}
          className="mt-6 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          variant="outline"
        >
          Refresh the Page
          <RefreshCcw className="h-5 w-5 text-red-600 dark:text-red-700 ml-3" />
        </Button>
      </div>
    </div>
  );
}
