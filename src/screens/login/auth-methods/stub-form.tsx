"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
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
import { useAuthUser } from "@/features/auth";
import { PlatformArea, ProductFlavorConfigContext } from "@/shared/config";
import { Button, Card } from "@/shared/ui";

export function StubAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthUser, logout } = useAuthUser();
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
    // Clear any existing user session on mount
    logout();
  }, []);

  useEffect(() => {
    if (authUser) {
      setAuthUser(authUser);
      router.push(`/${PlatformArea.core}/twinclass`);
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
      <Image
        className="rounded-full"
        src={config.favicon}
        width={56}
        height={56}
        alt="Domain icon"
      />
      <h1 className="my-3 text-lg font-bold">
        {config.key ?? config.productName}
      </h1>

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
