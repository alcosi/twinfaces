"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { ComboboxFormField, TextFormField } from "@/components/form-fields";

import { DomainPublicView } from "@/entities/domain";
import { loginFormAction } from "@/entities/user";
import { LOGIN_FORM_SCHEMA } from "@/entities/user/server";
import { useAuthUser } from "@/features/auth";
import { ThemeToggle } from "@/features/ui/theme-toggle";
import { PlatformArea, ProductFlavorConfigContext } from "@/shared/config";
import { Button } from "@/shared/ui";

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

  const form = useForm<z.infer<typeof LOGIN_FORM_SCHEMA>>({
    resolver: zodResolver(LOGIN_FORM_SCHEMA),
    defaultValues: {
      domainId: "",
      userId: config.loginPage.defaultFormValues.userId,
      businessAccountId: "",
    },
  });

  const { handleSubmit, control, setValue } = form;

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
        <FormProvider {...form}>
          <form
            className="flex flex-col gap-4 w-full"
            onSubmit={handleSubmit((values) => {
              const formData = new FormData();
              formData.set("userId", values.userId);
              formData.set("domainId", values.domainId);
              formData.set("businessAccountId", values.businessAccountId ?? "");

              startTransition(() => formAction(formData));
            })}
          >
            <ComboboxFormField
              control={control}
              name="domainId"
              required
              label="Domain"
              getById={() => Promise.resolve(undefined)}
              getItems={() => Promise.resolve(domains)}
              renderItem={(item) => item.key}
              onSelect={(items) => {
                const domain = items?.[0] || null;
                setValue("domainId", domain?.id ?? "");
              }}
              selectPlaceholder="Select domain..."
              buttonClassName="w-full"
              contentClassName="w-[--radix-popover-trigger-width]"
            />

            <TextFormField
              control={control}
              label="User Id"
              name="userId"
              required
            />

            <TextFormField
              control={control}
              label="Business Account Id"
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
        </FormProvider>
      </div>
    </main>
  );
}
