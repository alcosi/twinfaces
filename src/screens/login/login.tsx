"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ComboboxFormField, TextFormField } from "@/components/form-fields";

import { DomainPublicView, useDomainSelectAdapter } from "@/entities/domain";
import { DomainUser_DETAILED, hydrateDomainUserFromMap } from "@/entities/user";
import { useAuthUser } from "@/features/auth";
import { useDomainPublic } from "@/features/domain";
import { ThemeToggle } from "@/features/ui/theme-toggle";
import { PublicApiContext } from "@/shared/api";
import { PlatformArea, ProductFlavorConfigContext } from "@/shared/config";
import { FIRST_ID_EXTRACTOR, isPopulatedArray } from "@/shared/libs";
import { Button, Form } from "@/shared/ui";

const FORM_SCHEMA = z.object({
  userId: z.string().uuid("Please enter a valid UUID"),
  businessAccountId: z.string().uuid("Please enter a valid UUID").optional(),
  domainId: z
    .string()
    .uuid("Domain ID must be a valid UUID")
    .or(FIRST_ID_EXTRACTOR),
});
type FormValues = z.infer<typeof FORM_SCHEMA>;

export function Login() {
  const router = useRouter();
  const publicApiClient = useContext(PublicApiContext);
  const { setAuthUser, logout } = useAuthUser();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const config = useContext(ProductFlavorConfigContext);
  const domainAdapter = useDomainSelectAdapter();
  const [selectedDomain, setSelectedDomain] = useState<DomainPublicView | null>(
    null
  );
  const { domains } = useDomainPublic();
  const domainRef = useRef<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Clear any existing user session
    logout();
  }, []);

  const form = useForm({
    defaultValues: {
      userId: config?.loginPage.defaultFormValues.userId,
      businessAccountId: config?.loginPage.defaultFormValues.businessAccountId,
      domainId: config.id ?? "",
    },
    resolver: zodResolver(FORM_SCHEMA),
  });

  const domainWatch = useWatch({ control: form.control, name: "domainId" });

  useEffect(() => {
    if (domainWatch && domains.length > 0) {
      const domainId = (domainWatch as unknown as Array<{ id: string }>)[0]?.id;
      const domain = domains.find((item) => item.id === domainId);

      if (domain && domain.id !== domainRef.current) {
        setSelectedDomain(domain);
        domainRef.current = domain.id!;

        saveDomainIdToCookies(domain.id!);

        router.refresh();
      }
    }
  }, [domainWatch, domains, router]);

  const saveDomainIdToCookies = (domainId: string) => {
    document.cookie = `domainId=${domainId}; path=/; max-age=600`;
  };

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
      setIsLoggingIn(false);
      router.push(`/${PlatformArea.core}/twinclass`);
    }
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen relative">
      <div className="absolute flex top-3 right-6">
        <ThemeToggle />
      </div>

      <div className="flex flex-col my-5 items-center -mt-32 min-w-96">
        <Image
          className="rounded-full"
          src={
            (theme === "light"
              ? selectedDomain?.iconLight
              : selectedDomain?.iconDark) ?? config.favicon
          }
          width={56}
          height={56}
          alt="Domain icon"
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

            <div className="absolute flex items-center top-0 left-3 w-full max-w-xs z-10 space-x-3">
              <Globe />
              <ComboboxFormField
                control={form.control}
                name="domainId"
                selectPlaceholder="Select domain..."
                searchPlaceholder="Search..."
                noItemsText="No data found"
                {...domainAdapter}
              />
            </div>

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
