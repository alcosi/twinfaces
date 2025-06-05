import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { TextFormField } from "@/components/form-fields";

import {
  CONFIRM_AUTH_FORM_SCHEMA,
  confirmAuthAction,
} from "@/entities/user/server";
import { isUndefined } from "@/shared/libs";
import { Button } from "@/shared/ui";

export function ConfirmAuthForm({
  onBack,
  setShake,
  email,
  isShaking,
  toggleMode,
}: {
  onBack: () => void;
  setShake: (value: boolean) => void;
  email: string | null;
  isShaking: boolean;
  toggleMode: () => void;
}) {
  const [isAuthenticating, startAuthTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const domainId = searchParams.get("domainId") ?? undefined;

  const confirmForm = useForm<z.infer<typeof CONFIRM_AUTH_FORM_SCHEMA>>({
    resolver: zodResolver(CONFIRM_AUTH_FORM_SCHEMA),
    defaultValues: {
      domainId,
      verificationToken: "",
    },
  });

  function onConfirmSubmit(values: z.infer<typeof CONFIRM_AUTH_FORM_SCHEMA>) {
    if (isUndefined(domainId)) {
      throw new Error("Domain ID is required");
    }

    const formData = new FormData();
    formData.set("domainId", values.domainId);
    formData.set("verificationToken", values.verificationToken);

    startAuthTransition(async () => {
      try {
        const response = await confirmAuthAction(null, formData);

        if (response.status !== 0) {
          throw new Error("Confirm failed");
        }

        toggleMode();
        toast.success("Confirm success! Account was created");
      } catch (err) {
        setShake(true);
        setAuthError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
        confirmForm.reset();
      } finally {
        setTimeout(() => {
          setShake(false);
        }, 500);
      }
    });
  }

  return (
    <FormProvider {...confirmForm}>
      <span className="text-muted-foreground block w-full text-center">
        {email ? (
          <>
            We sent a verification token to{" "}
            <a
              href={`mailto:${email}`}
              className="text-primary underline hover:opacity-80"
            >
              {email}
            </a>
          </>
        ) : (
          "We sent a verification token to your email"
        )}
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

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={isAuthenticating || isShaking}
        >
          Confirm
        </Button>

        {authError && <p className="text-error text-center">{authError}</p>}

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
