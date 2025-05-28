"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { ComboboxFormField } from "@/components/form-fields";

import { DOMAIN_ID_SCHEMA, DomainPublicView } from "@/entities/domain";
import { useAuthUser } from "@/features/auth";
import { ProductFlavorConfigContext } from "@/shared/config";
import { Button } from "@/shared/ui";

type Props = {
  domains: DomainPublicView[];
};

const Schema = z.object({
  domainId: DOMAIN_ID_SCHEMA,
});

export function DomainSelectForm({ domains }: Props) {
  const router = useRouter();
  const { logout } = useAuthUser();
  const config = useContext(ProductFlavorConfigContext);

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: { domainId: "" },
  });

  useEffect(() => {
    logout();
  }, []);

  function onSubmit({ domainId }: z.infer<typeof Schema>) {
    router.push(`/auth?domainId=${encodeURIComponent(domainId)}`);
  }

  return (
    <div className="flex min-w-96 flex-col items-center">
      <Image
        className="rounded-full"
        src={config.favicon}
        width={56}
        height={56}
        alt="Domain icon"
      />
      <h1 className="text-primary my-6 text-center text-2xl font-bold">
        {config.key ?? config.productName}
      </h1>

      <FormProvider {...form}>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <ComboboxFormField
            control={form.control}
            name="domainId"
            label="Domain"
            required
            getById={() => Promise.resolve(undefined)}
            getItems={() => Promise.resolve(domains)}
            renderItem={(item) => item.key}
            onSelect={(items) => {
              const selected = items?.[0];
              form.setValue("domainId", selected?.id ?? "");
            }}
            selectPlaceholder="Select domain..."
            buttonClassName="w-full"
            contentClassName="w-(--radix-popover-trigger-width)"
          />

          <Button type="submit" className="w-full" size="lg">
            Proceed
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
