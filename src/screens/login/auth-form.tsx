"use client";

import { useContext, useState } from "react";
import { useFormState } from "react-dom";
import { FormProvider } from "react-hook-form";

import { TextFormItem } from "@/components/form-fields/text";

import { loginAction } from "@/entities/user";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import { FlipCard } from "@/features/ui/flip-card";
import { ProductFlavorConfigContext } from "@/shared/config";
import { Button, ThemeImage } from "@/shared/ui";

function DomainLogo({
  iconLight,
  iconDark,
}: {
  iconLight: string;
  iconDark: string;
}) {
  const domainIconUrl = "/favicon.png";

  return (
    <ThemeImage
      className="mx-auto h-14 w-14 rounded-full shadow-md"
      lightSrc={iconLight ?? domainIconUrl}
      darkSrc={iconDark ?? domainIconUrl}
      width={56}
      height={56}
      alt="Domain logo icon"
    />
  );
}

function signInAction() {
  // TBD
}

export function AuthForm() {
  const config = useContext(ProductFlavorConfigContext);
  const { alert } = useActionDialogs();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const [result, signInFormAction] = useFormState(loginAction, null);

  function toggleMode() {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
  }

  function onForgotPasswordClick() {
    // e.preventDefault();
    alert({
      title: "Forgot your password?",
      message:
        "No worries! To change your password, please contact your administrator at contact@onshelves.eu — they'll be happy to help you reset it and provide a new one.",
    });
  }

  function onLoginSubmit(values: unknown) {
    const formData = new FormData();
    formData.set("username", values.username);
    formData.set("password", values.password);

    signInFormAction(formData);
    // startTransition(() => formAction(formData));
  }

  return (
    <FlipCard
      isFlipped={mode === "signup"}
      className="relative w-full"
      front={
        <div className="h-full rounded-lg p-8">
          <DomainLogo
            iconLight={config.iconLight ?? config.favicon}
            iconDark={config.iconDark ?? config.favicon}
          />

          <h2 className="text-primary my-6 text-center text-2xl font-bold">
            Sign In
          </h2>

          <FormProvider {...form}>
            <form
              className="flex w-full flex-col space-y-4"
              onSubmit={onLoginSubmit}
            >
              <TextFormItem
                type="email"
                name="username"
                label="Username"
                placeholder="Enter your username"
                required
                value="admin@twinbox.io"
              />
              <TextFormItem
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                required
                value="some_test_password"
              />

              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>

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
                    Sign Up
                  </Button>
                </span>
              </div>
            </form>
          </FormProvider>
        </div>
      }
      back={
        <div className="h-full rounded-lg p-8">
          <DomainLogo
            iconLight={config.iconLight ?? config.favicon}
            iconDark={config.iconDark ?? config.favicon}
          />

          <h2 className="text-primary my-6 text-center text-2xl font-bold">
            Sign Up
          </h2>

          <form className="flex w-full flex-col space-y-4">
            <TextFormItem
              type="email"
              label="Email"
              placeholder="Enter your email"
              required
              disabled
            />
            <TextFormItem
              type="username"
              label="Username"
              placeholder="Enter your username"
              required
              disabled
            />
            <TextFormItem
              type="password"
              label="Password"
              placeholder="Create a password"
              required
              disabled
            />
            <TextFormItem
              type="password"
              label="Confirm Password"
              placeholder="Repeat your password"
              required
              disabled
            />

            <Button type="submit" className="w-full" size="lg" disabled>
              Create Account
            </Button>

            <span className="text-muted-foreground text-center text-sm">
              Already have an account?
              <Button
                variant="link"
                type="button"
                onClick={toggleMode}
                className="text-muted-foreground"
              >
                Sign In
              </Button>
            </span>
          </form>
        </div>
      }
    />
  );
}
