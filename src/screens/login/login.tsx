"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TextFormField } from "@/components/form-fields";

import { DomainUser_DETAILED, hydrateDomainUserFromMap } from "@/entities/user";
import { useAuthUser } from "@/features/auth";
import { PublicApiContext } from "@/shared/api";
import { PlatformArea, ProductFlavorConfigContext } from "@/shared/config";
import { isPopulatedArray, isUndefined } from "@/shared/libs";
import { Button, Form } from "@/shared/ui";

const FORM_SCHEMA = z.object({
  userId: z.string().uuid("Please enter a valid UUID"),
  businessAccountId: z.string().uuid("Please enter a valid UUID").optional(),
  domainId: z.string().uuid("Please enter a valid UUID"),
});
type FormValues = z.infer<typeof FORM_SCHEMA>;

export function Login() {
  const router = useRouter();
  const publicApiClient = useContext(PublicApiContext);
  const { setAuthUser } = useAuthUser();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const config = useContext(ProductFlavorConfigContext);

  const form = useForm({
    defaultValues: {
      userId: config?.loginPage.defaultFormValues.userId,
      businessAccountId: config?.loginPage.defaultFormValues.businessAccountId,
      domainId: config.id ?? "",
    },
    resolver: zodResolver(FORM_SCHEMA),
  });

  async function onSubmit(values: FormValues) {
    setIsLoggingIn(true);
    const { data } = await publicApiClient.user.searchDomainUsers({
      header: {
        DomainId: values.domainId,
        AuthToken: values.userId,
        Channel: "WEB",
      },
      pagination: { pageIndex: 0, pageSize: 10 },
      filters: {
        userIdList: [values.userId],
        businessAccountIdList: [],
      },
    });

    setIsLoggingIn(false);
    const index =
      data?.users?.findIndex((user) => user.userId === values.userId) ?? -1;
    if (isPopulatedArray<DomainUser_DETAILED>(data?.users) && index !== -1) {
      const hydratedDomainUser = hydrateDomainUserFromMap(
        data.users[index]!,
        data.relatedObjects
      );

      setAuthUser({
        domainUser: hydratedDomainUser,
        authToken: [values.userId, values.businessAccountId]
          .filter(Boolean)
          .join(","),
        domainId: values.domainId,
      });
      router.push(`/${PlatformArea.core}/twinclass`);
    }
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen">
      <div className="flex flex-col my-5 items-center -mt-32 min-w-96">
        <Image
          className="rounded-full"
          src={config.iconLight ?? config.favicon}
          width={56}
          height={56}
          alt="Picture of the author"
        />
        <h1 className="text-lg font-bold my-3">
          {config.key ?? config.productName}
        </h1>

        <Form {...form}>
          <form
            className="space-y-4 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <TextFormField
              control={form.control}
              name="userId"
              label="User Id"
            />

            <TextFormField
              control={form.control}
              name="businessAccountId"
              label="Business Account Id"
            />

            {isUndefined(config.id) && (
              <TextFormField
                control={form.control}
                name="domainId"
                label="Domain Id"
              />
            )}

            <Button
              type="submit"
              className="w-full"
              loading={isLoggingIn}
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
