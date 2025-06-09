import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { TextFormField } from "@/components/form-fields";

import {
  EMAIL_VERIFICATION_FORM_SCHEMA,
  confirmAuthAction,
  getDomainUserData,
  loginAuthAction,
} from "@/entities/user/server";
import { useAuthUser } from "@/features/auth";
import { isUndefined } from "@/shared/libs";
import { Button } from "@/shared/ui";

export function EmailVerificationForm({
  onBack,
  setShake,
  email,
  password,
  isShaking,
}: {
  onBack: () => void;
  setShake: (value: boolean) => void;
  email: string | null;
  password: string | null;
  isShaking: boolean;
}) {
  const { setAuthUser } = useAuthUser();
  const [isAuthenticating, startAuthTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
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
    if (isUndefined(domainId)) {
      throw new Error("Domain ID is required");
    }

    const formData = new FormData();
    formData.set("domainId", values.domainId);
    formData.set("verificationToken", values.verificationToken);

    const userCredentials = new FormData();
    userCredentials.set("domainId", values.domainId);
    userCredentials.set("username", email!);
    userCredentials.set("password", password!);

    startAuthTransition(async () => {
      try {
        const response = await confirmAuthAction(null, formData);

        if (response.status !== 0) {
          throw new Error("Confirm failed");
        }

        const { authData } = await loginAuthAction(null, userCredentials);
        const authToken = authData?.auth_token;

        if (isUndefined(authToken)) {
          throw new Error("Login failed: no auth token returned");
        }

        const domainUser = await getDomainUserData({ domainId, authToken });

        if (isUndefined(domainUser)) {
          throw new Error("Failed to load domain user");
        }

        setAuthUser({
          domainUser: domainUser,
          authToken: authToken,
          domainId,
          userId: domainUser.userId,
        });

        router.push("/profile");
      } catch (err) {
        setShake(true);
        setAuthError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
        emailVerificationForm.reset();
      } finally {
        setTimeout(() => {
          setShake(false);
        }, 500);
      }
    });
  }

  const recipient = email ? (
    <a
      href={`mailto:${email}`}
      className="text-primary underline hover:opacity-80"
    >
      {email}
    </a>
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
            placeholder="Enter your verification token from email"
            required
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isAuthenticating || isShaking}
            disabled={!emailVerificationForm.formState.isDirty}
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
    </div>
  );
}
