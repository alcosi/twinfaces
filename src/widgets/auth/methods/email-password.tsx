"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { getAuthenticatedUser, loginAuthAction } from "@/entities/user/server";
import { useAuthUser } from "@/features/auth";
import { DomainLogo } from "@/features/domain/ui";
import { FlipCard } from "@/features/ui/flip-card";
import { isApiErrorResponse } from "@/shared/api/utils";
import { ProductFlavorConfigContext } from "@/shared/config";
import { cn, isUndefined, sleep } from "@/shared/libs";
import { StepsProgressBar } from "@/shared/ui";

import { EmailPasswordSignInForm } from "../forms/email-password-sign-in";
import { EmailPasswordSignUpForm } from "../forms/email-password-sign-up";
import { EmailVerificationForm } from "../forms/email-verification";

export function EmailPasswordAuthWidget() {
  const config = useContext(ProductFlavorConfigContext);
  const { logout } = useAuthUser();

  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [credentials, setCredentials] = useState<{
    email?: string;
    password?: string;
  }>({});
  const router = useRouter();
  const { setAuthUser } = useAuthUser();
  const searchParams = useSearchParams();
  const domainId = searchParams.get("domainId") ?? undefined;
  const [step, setStep] = useState<"sign-up" | "email-verification">("sign-up");
  const [isShaking, setShake] = useState(false);

  useEffect(() => {
    logout();
  }, []);

  function toggleMode() {
    setMode((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"));
  }

  async function handleEmailVerification() {
    if (isUndefined(domainId)) {
      throw new Error("Domain ID is required");
    }

    const userCredentials = new FormData();
    userCredentials.set("domainId", domainId);
    userCredentials.set("username", credentials.email!);
    userCredentials.set("password", credentials.password!);

    const result = await loginAuthAction(null, userCredentials);

    if (!result.ok && isApiErrorResponse(result)) {
      throw new Error(`Login failed: ${result.statusDetails}`);
    }

    if (result.ok) {
      const authToken = result.data.authData?.auth_token;
      if (isUndefined(authToken)) {
        throw new Error("Login failed: no auth token returned");
      }

      const domainUser = await getAuthenticatedUser({
        domainId,
        authToken,
      });

      if (isUndefined(domainUser)) {
        throw new Error("Failed to load domain user");
      }

      setAuthUser({
        domainUser: domainUser,
        authToken: authToken,
        domainId,
      });

      router.push("/profile");
    }
  }

  function handleSignUp(credentials: { email?: string; password?: string }) {
    setStep("email-verification");
    setCredentials(credentials);
  }

  return (
    <FlipCard
      isFlipped={mode === "sign-up"}
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

          <EmailPasswordSignInForm
            toggleMode={toggleMode}
            onError={async () => {
              setShake(true);
              await sleep(500);
              setShake(false);
            }}
          />
        </div>
        // NOTE: Somewerhe here we migh also render <EmailVerificationForm />
      }
      back={
        <div className="flex h-full flex-col justify-between rounded-lg p-8">
          <h2 className="text-primary my-4 text-center text-2xl font-bold">
            {step === "sign-up" ? "Create Account" : "Confirm Your Email"}
          </h2>

          {step === "sign-up" ? (
            <EmailPasswordSignUpForm
              toggleMode={toggleMode}
              onSuccess={handleSignUp}
              onError={async () => {
                setShake(true);
                await sleep(500);
                setShake(false);
              }}
            />
          ) : (
            <EmailVerificationForm
              onBack={() => setStep("sign-up")}
              email={credentials.email || ""}
              onSuccess={handleEmailVerification}
              onError={async () => {
                setShake(true);
                await sleep(500);
                setShake(false);
              }}
            />
          )}

          <StepsProgressBar
            steps={["sign-up", "email-verification"]}
            current={step}
            containerClassName="flex justify-center pb-4"
          />
        </div>
      }
    />
  );
}
