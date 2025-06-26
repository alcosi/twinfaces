import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import { SecretTextFormField, TextFormField } from "@/components/form-fields";

import {
  EMAIL_PASSWORD_SIGN_IN_SCHEMA,
  getAuthenticatedUser,
  loginAuthAction,
} from "@/entities/user/server";
import { useAuthUser } from "@/features/auth";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import { capitalize, isUndefined } from "@/shared/libs";
import { Button, DialogDescription } from "@/shared/ui";

export function EmailPasswordSignInForm({
  toggleMode,
  onError,
}: {
  toggleMode: () => void;
  onError?: () => void;
}) {
  const router = useRouter();
  const { setAuthUser } = useAuthUser();
  const { alert } = useActionDialogs();
  const searchParams = useSearchParams();
  const [isAuthenticating, startAuthTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);
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
      title: "Forgot Password",
      message: ForgotPasswordAlertContent(),
    });
  }

  function onSignInSubmit(
    values: z.infer<typeof EMAIL_PASSWORD_SIGN_IN_SCHEMA>
  ) {
    setAuthError(null);

    const domainId = values.domainId;
    if (isUndefined(domainId)) {
      setAuthError("Domain ID is required");
      return;
    }

    const formData = new FormData();
    formData.set("domainId", domainId);
    formData.set("username", values.username);
    formData.set("password", values.password);

    startAuthTransition(async () => {
      const result = await loginAuthAction(null, formData);

      if (result.msg === "error" && result.statusDetails) {
        setAuthError(result.statusDetails);
        onError?.();
        signInForm.resetField("password");
        return;
      }

      const authToken = result.authData?.auth_token;

      if (isUndefined(authToken)) {
        setAuthError("Login failed. Please check your credentials");
        onError?.();
        signInForm.resetField("password");
        return;
      }

      const domainUser = await getAuthenticatedUser({ domainId, authToken });

      if (isUndefined(domainUser)) {
        setAuthError("Failed to fetch domain user data");
        onError?.();
        signInForm.resetField("password");
        return;
      }

      setAuthUser({
        domainUser,
        authToken,
        domainId,
      });

      router.push(`/profile`);
    });
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
          error={authError}
          placeholder="Enter your email"
          required
        />
        <SecretTextFormField
          control={signInForm.control}
          type="password"
          name="password"
          label="Password"
          error={authError}
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

        {authError && (
          <p className="text-error text-center">{capitalize(authError)}</p>
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

  const blocks = [
    {
      title: "Nie pamiętasz hasła?",
      text: "Nie martw się! Aby zmienić hasło, skontaktuj się z administratorem",
      afterLink: "— z przyjemnością pomoże Ci je zresetować i udostępni nowe.",
    },
    {
      title: "Forgot your password?",
      text: "No worries! To change your password, please contact your administrator at",
      afterLink:
        "— they'll be happy to help you reset it and provide a new one.",
    },
  ];

  return (
    <div className="space-y-4 p-6 text-balance" id="forgot-password">
      {blocks.map(({ title, text, afterLink }, i) => (
        <div key={i}>
          <DialogDescription className="font-bold text-[var(--color-primary)]">
            {title}
          </DialogDescription>
          <DialogDescription className="text-muted-foreground text-sm">
            {text}&nbsp;
            <a
              href={`mailto:${email}`}
              className="text-[var(--color-info)] underline hover:text-[var(--color-brand-600)]"
              target="_blank"
            >
              {email}
            </a>
            &nbsp;{afterLink}
          </DialogDescription>
        </div>
      ))}
    </div>
  );
}
