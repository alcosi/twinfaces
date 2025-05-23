import { notFound } from "next/navigation";

import { ThemeToggle } from "@/features/ui/theme-toggle";
import { TwinsAPI } from "@/shared/api";
import { components } from "@/shared/api/generated/schema";
import { isUndefined, safe } from "@/shared/libs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui";

import { AuthForm } from "./auth-form";
import { LoginForm } from "./form";

function AuthMehtodPasswordForm() {
  // TBD
}

const AUTH_METHOD_TO_FORM_MAP = {
  AuthMethodStubV1: LoginForm,
  AuthMethodPasswordV1: AuthForm,
};

export async function Login({ domainId }: { domainId: string }) {
  const authConfig = await fetchAuthConfig(domainId);
  console.log("foobar autoConfig", authConfig);

  const firstConfig = authConfig.authMethods[0];
  const FirstConfigComponent = AUTH_METHOD_TO_FORM_MAP[firstConfig.type];

  return (
    <main className="relative flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute top-3 right-6 flex">
        <ThemeToggle />
      </div>

      <div className="flex h-full w-full max-w-md items-center justify-evenly p-4">
        {isMultiElementArray(authConfig.authMethods) ? (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={`${firstConfig.type} #0`}
          >
            {authConfig.authMethods?.map((method, index) => {
              const key = `${method.type} #${index}`;
              const FormComponent = AUTH_METHOD_TO_FORM_MAP[method.type];

              return (
                <AccordionItem key={key} value={key} className="border-b-0">
                  <AccordionTrigger className="relative w-full">
                    <span className="text-sm font-medium underline">{key}</span>
                  </AccordionTrigger>
                  <AccordionContent className="py-2 pe-4">
                    <FormComponent />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <FirstConfigComponent className="" />
        )}
      </div>
    </main>
  );
}

type AuthConfigV1 = components["schemas"]["AuthConfigV1"];

async function fetchAuthConfig(domainId: string): Promise<AuthConfigV1> {
  const result = await safe(() =>
    TwinsAPI.POST("/auth/config/v1", {
      params: {
        header: {
          DomainId: domainId,
          Channel: "WEB",
        },
      },
    })
  );

  if (!result.ok) {
    notFound();
  }

  if (result.data.error) {
    throw new Error(result.data.error.msg);
  }

  if (isUndefined(result.data.data.config)) {
    throw new Error("Config is not returned");
  }

  console.log("foobar RESPONSE", result.data.data.config.authMethods);

  // result.data.data.config.authMethods?.push({ type: "AuthMethodPasswordV1" });
  // result.data.data.config.authMethods?.push({ type: "AuthMethodStubV1" });

  return result.data.data.config;
}

/**
 * Type guard for arrays with exactly one element.
 */
export function isSingleElementArray<T>(arr: unknown): arr is [T] {
  return Array.isArray(arr) && arr.length === 1;
}

/**
 * Type guard for arrays with two or more elements.
 */
export function isMultiElementArray<T>(arr: unknown): arr is [T, T, ...T[]] {
  return Array.isArray(arr) && arr.length > 1;
}
