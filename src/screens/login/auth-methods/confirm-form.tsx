import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { TextFormField } from "@/components/form-fields";

import {
  CONFIRM_AUTH_FORM_SCHEMA,
  confirmAuthAction,
  loginAuthAction,
} from "@/entities/user/server";
import { useAuthUser } from "@/features/auth";
import { isUndefined } from "@/shared/libs";
import { Button } from "@/shared/ui";

export function ConfirmAuthForm({
  onBack,
  setShake,
  email,
  password,
  isShaking,
  userName,
}: {
  onBack: () => void;
  setShake: (value: boolean) => void;
  email: string | null;
  password: string | null;
  userName: string | null;
  isShaking: boolean;
}) {
  const { setAuthUser } = useAuthUser();
  const [isAuthenticating, startAuthTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
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

    const userCredentials = new FormData();
    userCredentials.set("domainId", values.domainId);
    userCredentials.set("username", email!);
    userCredentials.set("password", password!);

    startAuthTransition(async () => {
      try {
        const response = await confirmAuthAction(null, formData);
        const { authData } = await loginAuthAction(null, userCredentials);

        if (response.status !== 0) {
          throw new Error("Confirm failed");
        }

        if (!isUndefined(authData?.auth_token)) {
          setAuthUser({
            domainUser: undefined,
            authToken: authData.auth_token,
            domainId,
            userName: userName!,
          });

          router.push("/profile");
          toast.success("Confirm success! You are logged into your account");
        }
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
