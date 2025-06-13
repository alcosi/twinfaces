import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

import { TextFormField } from "@/components/form-fields";

import {
  EMAIL_PASSWORD_SIGN_UP_FORM_SCHEMA,
  signUpAuthAction,
} from "@/entities/user/server";
import { isUndefined } from "@/shared/libs";
import { Button } from "@/shared/ui";

export function EmailPasswordSignUpForm({
  toggleMode,
  onSuccess,
  onError,
}: {
  toggleMode: () => void;
  onSuccess?: (_: { email?: string; password?: string }) => void;
  onError?: () => void;
}) {
  const searchParams = useSearchParams();
  const domainId = searchParams.get("domainId") ?? undefined;
  const [isAuthenticating, startAuthTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);

  const singUpForm = useForm<
    z.infer<typeof EMAIL_PASSWORD_SIGN_UP_FORM_SCHEMA>
  >({
    resolver: zodResolver(EMAIL_PASSWORD_SIGN_UP_FORM_SCHEMA),
    defaultValues: {
      domainId,
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSignUpSubmit(
    values: z.infer<typeof EMAIL_PASSWORD_SIGN_UP_FORM_SCHEMA>
  ) {
    if (isUndefined(domainId)) {
      throw new Error("Domain ID is required");
    }

    const formData = new FormData();
    formData.set("domainId", values.domainId);
    formData.set("firstName", values.firstName);
    formData.set("lastName", values.lastName);
    formData.set("email", values.email);
    formData.set("password", values.password);

    startAuthTransition(async () => {
      try {
        const response = await signUpAuthAction(null, formData);

        if (response.status !== 0) {
          throw new Error("Registration failed");
        }

        onSuccess?.({
          email: values.email,
          password: values.password,
        });
      } catch (err) {
        setAuthError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
        onError?.();
        singUpForm.resetField("password");
        singUpForm.resetField("confirmPassword");
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
          label="First name"
          placeholder="Enter your first name"
          required
        />
        <TextFormField
          control={singUpForm.control}
          name="lastName"
          type="text"
          label="Last name"
          placeholder="Enter your last name"
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
