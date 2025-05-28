import { notFound } from "next/navigation";

import { AuthMethodPassword, fetchAuthConfig } from "@/entities/user/server";
import { ThemeToggle } from "@/features/ui/theme-toggle";
import { isMultiElementArray, isPopulatedArray } from "@/shared/libs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui";

import {
  EmailPasswordAuthForm,
  StubAuthForm,
  UnderConstructionForm,
} from "./auth-methods";

const AUTH_METHOD_TO_FORM_MAP = {
  AuthMethodStubV1: StubAuthForm,
  AuthMethodPasswordV1: EmailPasswordAuthForm,
  AuthMethodPasswordV2: UnderConstructionForm,
  AuthMethodOath2V1: UnderConstructionForm,
};

export async function LoginScreen({ domainId }: { domainId: string }) {
  const authConfig = await fetchAuthConfig(domainId);

  if (!isPopulatedArray<AuthMethodPassword>(authConfig.authMethods)) {
    notFound();
  }

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
          <FirstConfigComponent />
        )}
      </div>
    </main>
  );
}
