"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { Form } from "react-hook-form";

import { ComboboxFormItem, TextFormItem } from "@/components/form-fields";

import { DomainPublicView } from "@/entities/domain";
import { loginFormAction } from "@/entities/user";
import { useAuthUser } from "@/features/auth";
import { ThemeToggle } from "@/features/ui/theme-toggle";
import { PlatformArea, ProductFlavorConfigContext } from "@/shared/config";
import { Button, Combobox } from "@/shared/ui";

type Props = {
  domains: DomainPublicView[];
  domainConfig?: Partial<DomainPublicView> | null;
};

export function LoginForm({ domains }: Props) {
  const router = useRouter();
  const { setAuthUser, logout } = useAuthUser();
  const config = useContext(ProductFlavorConfigContext);
  const [authUser, formAction] = useFormState(loginFormAction, null);
  const [isPending, startTransition] = useTransition();
  const [selectedDomain, setSelectedDomain] = useState<DomainPublicView | null>(
    null
  );
  // TODO remove
  // const [domainError, setDomainError] = useState<string | null>(null);

  useEffect(() => {
    // Clear any existing user session
    logout();
  }, []);

  useEffect(() => {
    if (authUser) {
      setAuthUser(authUser);
      router.push(`/${PlatformArea.core}/twinclass`);
    }
  }, [authUser]);

  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen relative">
      <div className="absolute flex top-3 right-6">
        <ThemeToggle />
      </div>

      <div className="flex flex-col my-5 items-center -mt-32 min-w-96">
        <Image
          className="rounded-full"
          src={config.favicon}
          width={56}
          height={56}
          alt="Domain icon"
        />
        <h1 className="text-lg font-bold my-3">
          {config.key ?? config.productName}
        </h1>
        {/* // TODO: resolve */}
        <Form>
          <form
            className="flex flex-col gap-4 w-full"
            action={async (formData) => {
              // if (!selectedDomain?.id) {
              //   setDomainError("Please select a domain");
              //   return;
              // }

              // setDomainError(null);
              // formData.set("domainId", selectedDomain.id);
              return startTransition(() => formAction(formData));
            }}
          >
            <ComboboxFormItem
              label="Domain"
              getById={() => Promise.resolve(undefined)}
              getItems={() => Promise.resolve(domains)}
              renderItem={(item) => item.key}
              onSelect={(items) => {
                setSelectedDomain(items?.[0] || null);
              }}
              selectPlaceholder="Select domain..."
              buttonClassName="w-full"
              contentClassName="w-[--radix-popover-trigger-width]"
            />
            {/* {domainError && <p className="text-destructive">{domainError}</p>} */}

            <TextFormItem
              label="User Id"
              inputId="userId"
              name="userId"
              defaultValue={config.loginPage.defaultFormValues.userId}
              required
            />

            <TextFormItem
              label="Business Account Id"
              inputId="businessAccountId"
              name="businessAccountId"
            />

            <Button
              type="submit"
              className="w-full"
              loading={isPending}
              size="lg"
            >
              Login
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
