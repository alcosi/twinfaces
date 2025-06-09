import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import { TextFormField } from "@/components/form-fields";

import {
  SIGN_UP_AUTH_FORM_SCHEMA,
  signUpAuthAction,
} from "@/entities/user/server";
import { isUndefined } from "@/shared/libs";
import { Button } from "@/shared/ui";

export function EmailPasswordSignUpForm({
  toggleMode,
  setRegisterStep,
  setRegisterEmail,
  setRegisterPassword,
  onError,
}: {
  toggleMode: () => void;
  setRegisterStep: (value: "register" | "confirm") => void;
  setRegisterEmail: (value: string | null) => void;
  setRegisterPassword: (value: string | null) => void;
  onError?: () => void;
}) {
  const searchParams = useSearchParams();
  const domainId = searchParams.get("domainId") ?? undefined;
  const [isAuthenticating, startAuthTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);

  const singUpForm = useForm<z.infer<typeof SIGN_UP_AUTH_FORM_SCHEMA>>({
    resolver: zodResolver(SIGN_UP_AUTH_FORM_SCHEMA),
    defaultValues: {
      domainId,
      email: "",
      firstName: "",
      password: "",
      confirmPassword: "",
      // email: "somsa@email.com",
      // firstName: "john doe",
      // password: "helloworld",
      // confirmPassword: "helloworld",
    },
  });

  function onSignUpSubmit(values: z.infer<typeof SIGN_UP_AUTH_FORM_SCHEMA>) {
    if (isUndefined(domainId)) {
      throw new Error("Domain ID is required");
    }

    const formData = new FormData();
    formData.set("domainId", values.domainId);
    formData.set("firstName", values.firstName);
    formData.set("email", values.email);
    formData.set("password", values.password);

    startAuthTransition(async () => {
      try {
        const response = await signUpAuthAction(null, formData);

        if (response.status !== 0) {
          throw new Error("Registration failed");
        }

        setRegisterEmail(values.email);
        setRegisterPassword(values.password);
        setRegisterStep("confirm");
      } catch (err) {
        setAuthError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
        onError?.();
        singUpForm.reset();
        setRegisterEmail(null);
        setRegisterPassword(null);
      }
    });
  }

  return (
    <FormProvider {...singUpForm}>
      <form
        className="flex w-full flex-col space-y-4"
        onSubmit={singUpForm.handleSubmit(onSignUpSubmit)}
      >
        <TextFormField
          control={singUpForm.control}
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          required
        />
        <TextFormField
          control={singUpForm.control}
          name="firstName"
          type="text"
          label="Username"
          placeholder="Enter your username"
          required
        />
        <TextFormField
          control={singUpForm.control}
          name="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          required
        />
        <TextFormField
          control={singUpForm.control}
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Repeat your password"
          required
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={isAuthenticating}
          disabled={!singUpForm.formState.isDirty}
        >
          Continue
        </Button>

        {authError && <p className="text-error text-center">{authError}</p>}

        <span className="text-muted-foreground text-center text-sm">
          Already have an account?
          <Button
            variant="link"
            type="button"
            onClick={toggleMode}
            className="text-muted-foreground"
          >
            Login
          </Button>
        </span>
      </form>
    </FormProvider>
  );
}
