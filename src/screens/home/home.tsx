"use client";

import { TextFormField } from "@/components/form-fields";
import { useAuthUser } from "@/features/auth";
import { Button, Form } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FORM_SCHEMA = z.object({
  authToken: z.string().uuid("Auth token must be a valid UUID"),
  domainId: z.string().uuid("Domain id must be a valid UUID"),
});
type FormValues = z.infer<typeof FORM_SCHEMA>;

export function Home() {
  const { setAuthUser } = useAuthUser();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      authToken: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
      domainId: "f67ad556-dd27-4871-9a00-16fb0e8a4102",
    },
    resolver: zodResolver(FORM_SCHEMA),
  });

  function onSubmit(values: FormValues) {
    setAuthUser({
      authToken: values.authToken,
      domainId: values.domainId,
    });
    router.push("/workspace/twinclass");
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen">
      <div className="flex flex-col my-5 items-center -mt-32 min-w-56">
        <Image
          src="/favicon.png"
          width={56}
          height={56}
          alt="Picture of the author"
        />
        <h1 className="text-lg font-bold my-3">Twin Faces</h1>

        <Form {...form}>
          <form
            className="space-y-4 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <TextFormField
              control={form.control}
              name="authToken"
              label="Auth token"
            />

            <TextFormField
              control={form.control}
              name="domainId"
              label="Domain id"
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
