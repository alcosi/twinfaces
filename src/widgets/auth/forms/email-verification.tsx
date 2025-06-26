import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { TextFormField } from "@/components/form-fields";

import {
  EMAIL_VERIFICATION_FORM_SCHEMA,
  verifyEmailAction,
} from "@/entities/user/server";
import { capitalize, isPopulatedString, isUndefined } from "@/shared/libs";
import { Button } from "@/shared/ui";

export function EmailVerificationForm({
  onBack,
  email,
  onSuccess,
  onError,
}: {
  onBack: () => void;
  email: string;
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const [isVerifying, startVerifyTransition] = useTransition();
  const [verificationError, setVerificationError] = useState<string>("");
  const searchParams = useSearchParams();
  const domainId = searchParams.get("domainId") ?? undefined;

  const emailVerificationForm = useForm<
    z.infer<typeof EMAIL_VERIFICATION_FORM_SCHEMA>
  >({
    resolver: zodResolver(EMAIL_VERIFICATION_FORM_SCHEMA),
    defaultValues: {
      domainId,
      verificationToken: "",
    },
  });

  function onConfirmSubmit(
    values: z.infer<typeof EMAIL_VERIFICATION_FORM_SCHEMA>
  ) {
    setVerificationError("");

    const domainId = values.domainId;
    if (isUndefined(domainId)) {
      setVerificationError("Domain ID is required");
      return;
    }

    const formData = new FormData();
    formData.set("domainId", domainId);
    formData.set("verificationToken", values.verificationToken);

    startVerifyTransition(async () => {
      const result = await verifyEmailAction(null, formData);

      if (result.msg === "error" && result.statusDetails) {
        setVerificationError(
          result.statusDetails || "Email verification failed"
        );
        onError?.();
        emailVerificationForm.reset();
        return;
      }

      if (result?.status !== 0) {
        setVerificationError("Email verification failed");
        onError?.();
        emailVerificationForm.reset();
        return;
      }

      onSuccess?.();
    });
  }

  const recipient = isPopulatedString(email) ? (
    <Link
      href={`mailto:${email}`}
      className="text-primary underline hover:opacity-80"
    >
      {email}
    </Link>
  ) : (
    "your email"
  );

  return (
    <div className="flex flex-1 flex-col justify-center">
      <p className="text-muted-foreground block w-full text-center">
        We&#39;ve sent a verification token to {recipient}.
      </p>

      <FormProvider {...emailVerificationForm}>
        <form
          className="mt-6 flex w-full flex-col space-y-4"
          onSubmit={emailVerificationForm.handleSubmit(onConfirmSubmit)}
        >
          <TextFormField
            control={emailVerificationForm.control}
            type="text"
            name="verificationToken"
            label="Verification token"
            error={verificationError}
            placeholder="Enter your verification token from email"
            required
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isVerifying}
            disabled={!emailVerificationForm.formState.isDirty}
          >
            Confirm
          </Button>

          {isPopulatedString(verificationError) && (
            <p className="text-error text-center">
              {capitalize(verificationError)}
            </p>
          )}

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
    </div>
  );
}
