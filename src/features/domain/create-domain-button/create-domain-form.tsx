"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { TextAreaFormField, TextFormField } from "@/components/form-fields";

import { DOMAIN_CREATE_SCHEMA } from "@/entities/domain";
import { PrivateApiContext } from "@/shared/api";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

import { useQuickView } from "../../quick-view-overlay";

export function CreateDomainForm() {
  const api = useContext(PrivateApiContext);
  const { closeQuickView } = useQuickView();

  const form = useForm<z.infer<typeof DOMAIN_CREATE_SCHEMA>>({
    resolver: zodResolver(DOMAIN_CREATE_SCHEMA),
    defaultValues: {
      name: "",
      key: "",
      description: "",
      type: undefined,
      defaultLocale: undefined,
    },
  });

  async function onSubmit(formValues: z.infer<typeof DOMAIN_CREATE_SCHEMA>) {
    // const formData = new FormData();
    // formData.append(
    //   "request",
    //   JSON.stringify({
    //     key: formValues.key,
    //     description: formValues.description,
    //     type: formValues.type,
    //     defaultLocale: formValues.defaultLocale,
    //   })
    // );

    // if (formValues.iconDark && formValues.iconDark[0]) {
    //   formData.append("iconDark", formValues.iconDark[0]);
    // }
    // if (formValues.iconLight && formValues.iconLight[0]) {
    //   formData.append("iconLight", formValues.iconLight[0]);
    // }

    const { error } = await api.domain.create({
      body: { domain: { ...formValues } },
    });

    if (error) {
      throw error;
    }

    form.reset({
      name: undefined,
      key: "",
      description: "",
      type: undefined,
      defaultLocale: undefined,
    });

    toast.success("Domain created successfully!");
    closeQuickView();
    setTimeout(() => {
      window.location.reload();
    }, 750);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <section className="flex h-full flex-col px-6">
          <header className="flex h-12 items-center justify-between">
            <h1 className="font-semibold">Create domain</h1>
            <Button
              className=""
              variant="ghost"
              size="icon"
              onClick={closeQuickView}
            >
              <X className="h-5 w-5" />
            </Button>
          </header>
          <main className="flex flex-1 items-center justify-center py-10">
            <div className="w-2/3 space-y-6">
              <TextFormField
                control={form.control}
                name="name"
                label="Name"
                autoFocus={true}
              />

              <TextFormField control={form.control} name="key" label="Key" />

              <TextAreaFormField
                control={form.control}
                name="description"
                label="Description"
              />

              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          key={field.value || "default-key"}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent className="z-40">
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="b2b">B2B</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultLocale"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Default locale</FormLabel>
                      <FormControl>
                        <Select
                          key={field.value || "default-key"}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="z-40">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ru">Russian</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* <FileFormField
                control={form.control}
                name="iconDark"
                label="Dark Icon"
              />
              <FileFormField
                control={form.control}
                name="iconLight"
                label="Light Icon"
              /> */}
          </main>

          <footer className="flex justify-end">
            <Button type="submit">Create</Button>
          </footer>
        </section>
      </form>
    </Form>
  );
}
