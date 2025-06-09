"use client";

import { useContext, useEffect, useState } from "react";

import { useAuthUser } from "@/features/auth";
import { DomainLogo } from "@/features/domain/ui";
import { FlipCard } from "@/features/ui/flip-card";
import { ProductFlavorConfigContext } from "@/shared/config";
import { cn, sleep } from "@/shared/libs";
import { StepsProgressBar } from "@/shared/ui";

import { EmailPasswordSignInForm } from "../forms/email-password-sign-in";
import { EmailPasswordSignUpForm } from "../forms/email-password-sign-up";
import { EmailVerificationForm } from "../forms/email-verification";

export function EmailPasswordAuthWidget() {
  const config = useContext(ProductFlavorConfigContext);
  const { logout } = useAuthUser();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [registerEmail, setRegisterEmail] = useState<string | null>(null);
  const [registerPassword, setRegisterPassword] = useState<string | null>(null);

  const [registerStep, setRegisterStep] = useState<"register" | "confirm">(
    "register"
  );

  const [isShaking, setShake] = useState(false);

  useEffect(() => {
    logout();
  }, []);

  function toggleMode() {
    setMode((prev) => (prev === "login" ? "register" : "login"));
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
              {registerStep === "register"
                ? "Create Account"
                : "Confirm Your Email"}
            </h2>
          </div>

          {registerStep === "register" ? (
            <EmailPasswordSignUpForm
              toggleMode={toggleMode}
              setRegisterStep={setRegisterStep}
              setRegisterEmail={setRegisterEmail}
              setRegisterPassword={setRegisterPassword}
              onError={async () => {
                setShake(true);
                await sleep(500);
                setShake(false);
              }}
            />
          ) : (
            <EmailVerificationForm
              onBack={() => setRegisterStep("register")}
              email={registerEmail}
              password={registerPassword}
              onError={async () => {
                setShake(true);
                await sleep(500);
                setShake(false);
              }}
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
