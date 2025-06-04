import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { TextFormField } from "@/components/form-fields";

import { CONFIRM_AUTH_FORM_SCHEMA } from "@/entities/user/server";
import { Button } from "@/shared/ui";

export function ConfirmAuthForm({ onBack }: { onBack: () => void }) {
  const searchParams = useSearchParams();
  const domainId = searchParams.get("domainId") ?? undefined;

  const confirmForm = useForm<z.infer<typeof CONFIRM_AUTH_FORM_SCHEMA>>({
    resolver: zodResolver(CONFIRM_AUTH_FORM_SCHEMA),
    defaultValues: {
      domainId,
      verificationToken: "",
    },
  });

  function onConfirmSubmit() {
    //TODO implement functional /auth/signup_by_email/confirm/v1
  }

  return (
    <FormProvider {...confirmForm}>
      <span className="text-muted-foreground text-center">
        We sent a verification token to TODO: email
      </span>
      <form
        className="mt-6 flex w-full flex-col space-y-4"
        onSubmit={confirmForm.handleSubmit(onConfirmSubmit)}
      >
        <TextFormField
          control={confirmForm.control}
          type="text"
          name="verificationToken"
          label="Verification token"
          placeholder="Enter your verification token from email"
          required
        />

        <Button type="submit" className="w-full" size="lg">
          Confirm
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBack}
        >
          Go back to the previous step
        </Button>
      </form>
    </FormProvider>
  );
}
