"use client";

import {
  TextFormField,
  TextFormItem,
} from "@/components/form-fields/text-form-field";
import { Button } from "@/shared/ui";
import { Smile } from "lucide-react";
import Link from "next/link";

export function Home() {
  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen">
      <div className="flex flex-col my-5 items-center -mt-32">
        <Smile className="h-14 w-14 text-primary" />
        <h1 className="text-lg font-bold my-3">Twin Faces</h1>

        <form className="space-y-4">
          <TextFormItem name={"userId"} label="User Id" />

          <Link href="/workspace/twinclass" className="block">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </Link>
        </form>
      </div>
    </main>
  );
}
