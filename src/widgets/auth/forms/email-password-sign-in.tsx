"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import { SecretTextFormField, TextFormField } from "@/components/form-fields";

import {
  EMAIL_PASSWORD_SIGN_IN_SCHEMA,
  getAuthenticatedUser,
  loginAuthAction,
} from "@/entities/user/server";
import { setAuthUser } from "@/features/auth";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import { isApiErrorResponse } from "@/shared/api/utils";
import { capitalize, isUndefined } from "@/shared/libs";
import { Button } from "@/shared/ui";

export function EmailPasswordSignInForm({
  toggleMode,
  onError,
}: {
  toggleMode: () => void;
  onError?: () => void;
}) {
  const router = useRouter();
  const { alert } = useActionDialogs();
  const searchParams = useSearchParams();
  const [isAuthenticating, startAuthTransition] = useTransition();
  const domainId = searchParams.get("domainId") ?? undefined;

  const signInForm = useForm<z.infer<typeof EMAIL_PASSWORD_SIGN_IN_SCHEMA>>({
    resolver: zodResolver(EMAIL_PASSWORD_SIGN_IN_SCHEMA),
    defaultValues: {
      domainId,
      username: "",
      password: "",
    },
  });

  function onForgotPasswordClick() {
    alert({
      title: "Nie pamiętasz hasła? / Forgot Password?",
      body: ForgotPasswordAlertContent(),
    });
  }

  function onSignInSubmit(
    values: z.infer<typeof EMAIL_PASSWORD_SIGN_IN_SCHEMA>
  ) {
    console.log("🚀 ~ onSignInSubmit ~ values:", values);
    signInForm.setError("root", {});

    const domainId = values.domainId;
    if (isUndefined(domainId)) {
      signInForm.setError("root", { message: "Domain ID is required" });
      return;
    }

    const formData = new FormData();
    formData.set("domainId", domainId);
    formData.set("username", values.username);
    formData.set("password", values.password);

    startAuthTransition(async () => {
      const result = await loginAuthAction(null, formData);

      if (!result.ok && isApiErrorResponse(result.error)) {
        const { statusDetails } = result.error;
        return handleAuthError(
          statusDetails ?? "Login failed. Please check your credentials"
        );
      }

      if (result.ok) {
        const authToken = result.data.authData?.auth_token;
        const authTokenExpiresAt = result.data.authData?.auth_token_expires_at;
        const refreshToken = result.data.authData?.refresh_token;
        const refreshTokenExpiresAt =
          result.data.authData?.refresh_token_expires_at;

        if (isUndefined(authToken)) {
          return handleAuthError("Login failed: no auth token returned");
        }
        await setAuthUser({
          domainId,
          authToken,
          authTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt,
        });

        const domainUser = await getAuthenticatedUser({
          domainId,
          authToken,
        });

        if (isUndefined(domainUser)) {
          return handleAuthError("Failed to load domain user");
        }

        await setAuthUser({
          userId: domainUser.userId,
        });

        router.push(`/profile`);
      }
    });
  }

  function handleAuthError(message: string) {
    signInForm.setError("root", { message });
    signInForm.resetField("password");
    onError?.();
  }

  return (
    <FormProvider {...signInForm}>
      <form
        className="flex w-full flex-col space-y-4"
        onSubmit={signInForm.handleSubmit(onSignInSubmit)}
      >
        <TextFormField
          control={signInForm.control}
          type="text"
          name="domainId"
          required
          disabled
          hidden
        />
        <TextFormField
          control={signInForm.control}
          name="username"
          label="Email"
          placeholder="Enter your email"
          required
        />
        <SecretTextFormField
          control={signInForm.control}
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          required
        />

        <Button
          type="submit"
          className="w-full"
          loading={isAuthenticating}
          size="lg"
          disabled={!signInForm.formState.isDirty}
        >
          Login
        </Button>

        {signInForm.formState.errors.root?.message && (
          <p className="text-error text-center">
            {capitalize(signInForm.formState.errors.root.message)}
          </p>
        )}

        <div className="flex flex-col justify-between text-sm">
          <Button
            variant="link"
            type="button"
            onClick={onForgotPasswordClick}
            className="text-muted-foreground"
          >
            Forgot password?
          </Button>

          <span className="text-muted-foreground text-center">
            Don&apos;t have an account?
            <Button
              variant="link"
              type="button"
              onClick={toggleMode}
              className="text-muted-foreground"
            >
              Create Account
            </Button>
          </span>
        </div>
      </form>
    </FormProvider>
  );
}

function ForgotPasswordAlertContent() {
  const email = "contact@onshelves.eu";

  return (
    <div className="space-y-4 p-6 text-balance" id="forgot-password">
      <p className="text-primary font-bold">Nie pamiętasz hasła?</p>
      <p className="text-muted-foreground text-sm">
        Nie martw się! Aby zmienić hasło, skontaktuj się z administratorem&nbsp;
        <a
          href={`mailto:${email}`}
          className="hover:text-brand-600 text-info underline"
          target="_blank"
        >
          {email}
        </a>
        &nbsp;— z przyjemnością pomoże Ci je zresetować i udostępni nowe.
      </p>

      <p className="text-primary font-bold">Forgot your password?</p>
      <p className="text-muted-foreground text-sm">
        No worries! To change your password, please contact your administrator
        at&nbsp;
        <a
          href={`mailto:${email}`}
          className="hover:text-brand-600 text-info underline"
          target="_blank"
        >
          {email}
        </a>
        &nbsp;— they'll be happy to help you reset it and provide a new one.
      </p>
    </div>
  );
}
