import { Alert, AlertDescription, AlertTitle } from "@/shared/ui";

export function UnderConstructionForm() {
  return (
    <Alert variant="warn">
      <AlertTitle className="col-start-2">
        This form is under construction
      </AlertTitle>
      <AlertDescription className="col-start-2">
        This authentication method will be available soon.
      </AlertDescription>
    </Alert>
  );
}
