import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import { TextFormField } from "@/components/form-fields";

import {
  LOGIN_AUTH_FORM_SCHEMA,
  getDomainUserData,
  loginAuthAction,
} from "@/entities/user/server";
import { useAuthUser } from "@/features/auth";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import { isUndefined } from "@/shared/libs";
import { Button } from "@/shared/ui";

export function EmailPasswordSignInForm({
  setShake,
  isShaking,
  toggleMode,
}: {
  setShake: (value: boolean) => void;
  isShaking: boolean;
  toggleMode: () => void;
}) {
  const router = useRouter();
  const { setAuthUser } = useAuthUser();
  const { alert } = useActionDialogs();
  const searchParams = useSearchParams();
  const [isAuthenticating, startAuthTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);
  const domainId = searchParams.get("domainId") ?? undefined;

  const loginForm = useForm<z.infer<typeof LOGIN_AUTH_FORM_SCHEMA>>({
    resolver: zodResolver(LOGIN_AUTH_FORM_SCHEMA),
    defaultValues: {
      domainId,
      username: "",
      password: "",
    },
  });

  function onForgotPasswordClick() {
    alert({
      title: "Forgot your password?",
      message:
        "No worries! To change your password, please contact your administrator at contact@onshelves.eu — they'll be happy to help you reset it and provide a new one.",
    });
  }

  function onLoginSubmit(values: z.infer<typeof LOGIN_AUTH_FORM_SCHEMA>) {
    if (isUndefined(domainId)) {
      throw new Error("Domain ID is required");
    }

    const formData = new FormData();
    formData.set("domainId", values.domainId);
    formData.set("username", values.username);
    formData.set("password", values.password);

    startAuthTransition(async () => {
      try {
        const { authData } = await loginAuthAction(null, formData);
        const authToken = authData?.auth_token;

        if (isUndefined(authToken)) {
          throw new Error("Login failed. Please check your credentials");
        }

        const domainUser = await getDomainUserData({ domainId, authToken });

        if (isUndefined(domainUser)) {
          throw new Error("Failed to fetch domain user data");
        }

        setAuthUser({
          domainUser: domainUser,
          authToken: authToken,
          domainId,
        });
        router.push(`/profile`);
      } catch (err) {
        setShake(true);
        setAuthError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
        loginForm.reset();
      } finally {
        setTimeout(() => {
          setShake(false);
        }, 500);
      }
    });
  }

  return (
    <FormProvider {...loginForm}>
      <form
        className="flex w-full flex-col space-y-4"
        onSubmit={loginForm.handleSubmit(onLoginSubmit)}
      >
        <TextFormField
          control={loginForm.control}
          type="text"
          name="domainId"
          required
          disabled
          hidden
        />
        <TextFormField
          control={loginForm.control}
          type="email"
          name="username"
          label="Email"
          placeholder="Enter your email"
          required
        />
        <TextFormField
          control={loginForm.control}
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          required
        />

        <Button
          type="submit"
          className="w-full"
          loading={isAuthenticating || isShaking}
          size="lg"
          disabled={!loginForm.formState.isDirty}
        >
          Login
        </Button>

        {authError && <p className="text-error text-center">{authError}</p>}

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
