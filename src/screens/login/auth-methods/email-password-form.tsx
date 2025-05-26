"use client";

import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { TextFormField, TextFormItem } from "@/components/form-fields/text";

import { emailPasswordAuthAction } from "@/entities/user";
import { EMAIL_PASSWORD_AUTH_FORM_SCHEMA } from "@/entities/user/server";
import { useAuthUser } from "@/features/auth";
import { useActionDialogs } from "@/features/ui/action-dialogs";
import { FlipCard } from "@/features/ui/flip-card";
import { PlatformArea, ProductFlavorConfigContext } from "@/shared/config";
import { isUndefined } from "@/shared/libs";
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

export function EmailPasswordAuthForm() {
  const config = useContext(ProductFlavorConfigContext);
  const { alert } = useActionDialogs();
  const router = useRouter();
  const { setAuthUser, logout } = useAuthUser();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [isAuthenticating, startAuthTransition] = useTransition();

  const loginForm = useForm<z.infer<typeof EMAIL_PASSWORD_AUTH_FORM_SCHEMA>>({
    resolver: zodResolver(EMAIL_PASSWORD_AUTH_FORM_SCHEMA),
    defaultValues: {
      domainId: config.id,
      username: "admin@twinbox.io",
      password: "some_test_password",
    },
  });

  const registerForm = useForm<any>({
    resolver: zodResolver(z.any()),
    defaultValues: {
      domainId: config.id,
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
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

  function onLoginSubmit(
    values: z.infer<typeof EMAIL_PASSWORD_AUTH_FORM_SCHEMA>
  ) {
    if (isUndefined(config.id)) {
      throw new Error("Domain ID is required");
    }

    const formData = new FormData();
    formData.set("domainId", values.domainId);
    formData.set("username", values.username);
    formData.set("password", values.password);

    startAuthTransition(async () => {
      try {
        const result = await emailPasswordAuthAction(null, formData);

        if (isUndefined(result.authData?.auth_token)) {
          throw new Error("Login failed. Please check your credentials");
        }

        setAuthUser({
          domainUser: undefined,
          authToken: result.authData.auth_token,
          domainId: config.id!,
        });
        router.push(`/${PlatformArea.core}/twinclass`);
      } catch {
        // TODO: show form error message instead of toast
        toast.error("Login failed. Please check your credentials.");
        loginForm.reset();
      }
    });
  }

  return (
    <>
      <FlipCard
        isFlipped={mode === "register"}
        className="relative w-full"
        front={
          <div className="h-full rounded-lg p-8">
            <DomainLogo
              iconLight={config.iconLight ?? config.favicon}
              iconDark={config.iconDark ?? config.favicon}
            />

            <h2 className="text-primary my-6 text-center text-2xl font-bold">
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
                  label="Username"
                  placeholder="Enter your username"
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
                  loading={isAuthenticating}
                  size="lg"
                >
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
                      Create Account
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
              Create Account
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
                Sign Up
              </Button>

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
          </div>
        }
      />
      <DevTool control={loginForm.control} />
    </>
  );
}
