"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { getDomainUserData, loginAuthAction } from "@/entities/user/server";
import { useAuthUser } from "@/features/auth";
import { DomainLogo } from "@/features/domain/ui";
import { FlipCard } from "@/features/ui/flip-card";
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
          <div>
            <DomainLogo
              iconLight={config.iconLight ?? config.favicon}
              iconDark={config.iconDark ?? config.favicon}
            />

            <h2 className="text-primary my-4 text-center text-2xl font-bold">
              {step === "sign-up" ? "Create Account" : "Confirm Your Email"}
            </h2>
          </div>

          {step === "sign-up" ? (
            <EmailPasswordSignUpForm
              toggleMode={toggleMode}
              // TODO: extract
              onSuccess={(credentials) => {
                setStep("email-verification");
                setCredentials(credentials);
              }}
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
              // TODO: extract to some `handleEmailVerification`
              onSuccess={async () => {
                if (isUndefined(domainId)) {
                  throw new Error("Domain ID is required");
                }

                const userCredentials = new FormData();
                userCredentials.set("domainId", domainId);
                userCredentials.set("username", credentials.email!);
                userCredentials.set("password", credentials.password!);

                const { authData } = await loginAuthAction(
                  null,
                  userCredentials
                );
                const authToken = authData?.auth_token;

                if (isUndefined(authToken)) {
                  throw new Error("Login failed: no auth token returned");
                }

                const domainUser = await getDomainUserData({
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
              }}
              onError={async () => {
                setShake(true);
                await sleep(500);
                setShake(false);
              }}
            />
          )}

          <StepsProgressBar
            steps={["register", "confirm"]}
            current={step}
            containerClassName="flex justify-center"
          />
        </div>
      }
    />
  );
}
