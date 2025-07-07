"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { TextFormField } from "@/components/form-fields";

import {
  STUB_AUTH_FORM_SCHEMA,
  stubLoginFormAction,
} from "@/entities/user/server";
import { DomainLogo } from "@/features/domain/ui";
import { ProductFlavorConfigContext } from "@/shared/config";
import { useAuthUserStore } from "@/shared/store";
import { Button, Card } from "@/shared/ui";

export function StubAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuthUser = useAuthUserStore((state) => state.setAuthUser);
  const logout = useAuthUserStore((state) => state.logout);
  const config = useContext(ProductFlavorConfigContext);
  const [authUser, formAction] = useFormState(stubLoginFormAction, null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof STUB_AUTH_FORM_SCHEMA>>({
    resolver: zodResolver(STUB_AUTH_FORM_SCHEMA),
    defaultValues: {
      domainId: searchParams.get("domainId") ?? "",
      userId: config.loginPage.defaultFormValues.userId,
      businessAccountId: "",
    },
  });

  useEffect(() => {
    logout();
  }, []);

  useEffect(() => {
    if (authUser) {
      setAuthUser(authUser);
      router.push("/profile");
    }
  }, [authUser]);

  function onSubmit(values: z.infer<typeof STUB_AUTH_FORM_SCHEMA>) {
    const formData = new FormData();
    formData.set("userId", values.userId);
    formData.set("domainId", values.domainId);
    formData.set("businessAccountId", values.businessAccountId ?? "");

    startTransition(() => formAction(formData));
  }

  return (
    <Card className="flex min-w-96 flex-col items-center p-8">
      <DomainLogo
        iconLight={config.iconLight ?? config.favicon}
        iconDark={config.iconDark ?? config.favicon}
      />

      <h2 className="text-primary my-4 text-center text-2xl font-bold">
        {config.key ?? config.productName}
      </h2>

      <FormProvider {...form}>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <TextFormField
            control={form.control}
            name="userId"
            label="User Id"
            required
          />

          <TextFormField
            control={form.control}
            name="businessAccountId"
            label="Business Account Id"
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
    </Card>
  );
}
