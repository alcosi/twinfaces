"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TextFormField } from "@/components/form-fields";

import { useAuthUser } from "@/features/auth";
import { useProjectConfig } from "@/features/project-config-context";
import { Button, Form } from "@/shared/ui";

const FORM_SCHEMA = z.object({
  userId: z.string().uuid("Please enter a valid UUID"),
  businessAccountId: z.string().uuid("Please enter a valid UUID").optional(),
  domainId: z.string().uuid("Please enter a valid UUID"),
});
type FormValues = z.infer<typeof FORM_SCHEMA>;

export function Login() {
  const { setAuthUser } = useAuthUser();
  const router = useRouter();
  const { config } = useProjectConfig();

  const form = useForm({
    defaultValues: {
      userId: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
      businessAccountId: undefined,
      domainId: config.defaultFormValues.domainId,
    },
    resolver: zodResolver(FORM_SCHEMA),
  });

  function onSubmit(values: FormValues) {
    setAuthUser({
      authToken: [values.userId, values.businessAccountId]
        .filter(Boolean)
        .join(","),
      domainId: values.domainId,
    });
    router.push("/workspace/twinclass");
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen">
      <div className="flex flex-col my-5 items-center -mt-32 min-w-96">
        <Image
          src={config.favicon}
          width={56}
          height={56}
          alt="Picture of the author"
        />
        <h1 className="text-lg font-bold my-3">{config.title}</h1>

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

            <TextFormField
              control={form.control}
              name="domainId"
              label="Domain Id"
            />

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
