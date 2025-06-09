"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { TextFormField } from "@/components/form-fields/text";

import {
  LOGIN_AUTH_FORM_SCHEMA,
  SIGN_UP_AUTH_FORM_SCHEMA,
  getDomainUserData,
  loginAuthAction,
  signUpAuthAction,
} from "@/entities/user/server";
import { useAuthUser } from "@/features/auth";
import { DomainLogo } from "@/features/domain/ui";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import { FlipCard } from "@/features/ui/flip-card";
import { ProductFlavorConfigContext } from "@/shared/config";
import { cn, isUndefined } from "@/shared/libs";
import { Button, StepsProgressBar } from "@/shared/ui";

import { EmailVerificationForm } from "../forms/email-verification";

export function EmailPasswordAuthWidget() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const config = useContext(ProductFlavorConfigContext);
  const { alert } = useActionDialogs();
  const { setAuthUser, logout } = useAuthUser();
  const domainId = searchParams.get("domainId") ?? undefined;

  const [mode, setMode] = useState<"login" | "register">("login");
  const [isAuthenticating, startAuthTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);
  const [registerEmail, setRegisterEmail] = useState<string | null>(null);
  const [registerPassword, setRegisterPassword] = useState<string | null>(null);

  const [registerStep, setRegisterStep] = useState<"register" | "confirm">(
    "register"
  );

  const [isShaking, setShake] = useState(false);

  const loginForm = useForm<z.infer<typeof LOGIN_AUTH_FORM_SCHEMA>>({
    resolver: zodResolver(LOGIN_AUTH_FORM_SCHEMA),
    defaultValues: {
      domainId,
      username: "",
      password: "",
    },
  });

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

  useEffect(() => {
    logout();
  }, []);

  function toggleMode() {
    setMode((prev) => (prev === "login" ? "register" : "login"));
  }

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

  function onSignUpSubmit(values: z.infer<typeof SIGN_UP_AUTH_FORM_SCHEMA>) {
    if (isUndefined(domainId)) {
      throw new Error("Domain ID is required");
    }

    const formData = new FormData();
    formData.set("domainId", values.domainId);
    formData.set("firstName", values.firstName);
    formData.set("email", values.email);
    formData.set("password", values.password);

    console.log(formData);

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
        setShake(true);
        setAuthError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
        singUpForm.reset();
        setRegisterEmail(null);
        setRegisterPassword(null);
      } finally {
        setTimeout(() => {
          setShake(false);
        }, 500);
      }
    });
  }

  return (
    <FlipCard
      isFlipped={mode === "register"}
      className={cn("relative w-full", isShaking && "animate-shake")}
      front={
        <div className="h-full rounded-lg p-8">
          <DomainLogo
            iconLight={config.iconLight ?? config.favicon}
            iconDark={config.iconDark ?? config.favicon}
          />

          <h2 className="text-primary my-4 text-center text-2xl font-bold">
            Welcome
          </h2>

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

              {authError && (
                <p className="text-error text-center">{authError}</p>
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
        </div>
        // NOTE: Somewerhe here we migh also render <EmailVerificationForm />
      }
      back={
        <div className="flex h-full flex-col justify-between rounded-lg p-8">
          <div>
            <DomainLogo
              iconLight={config.iconLight ?? config.favicon}
              iconDark={config.iconDark ?? config.favicon}
            />

            <h2 className="text-primary my-4 text-center text-2xl font-bold">
              {registerStep === "register"
                ? "Create Account"
                : "Confirm Your Email"}
            </h2>
          </div>

          {registerStep === "register" ? (
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
                  loading={isAuthenticating || isShaking}
                  disabled={!singUpForm.formState.isDirty}
                >
                  Continue
                </Button>

                {authError && (
                  <p className="text-error text-center">{authError}</p>
                )}

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
          ) : (
            <EmailVerificationForm
              onBack={() => setRegisterStep("register")}
              setShake={setShake}
              email={registerEmail}
              isShaking={isShaking}
              password={registerPassword}
            />
          )}

          <StepsProgressBar
            steps={["register", "confirm"]}
            current={registerStep}
            containerClassName="flex justify-center"
          />
        </div>
      }
    />
  );
}
