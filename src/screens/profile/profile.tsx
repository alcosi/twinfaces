"use client";

import { CalendarDays, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import {
  DomainUser,
  useFetchUserByAuthToken,
  useUpdateUser,
} from "@/entities/user";
import { InPlaceEdit, InPlaceEditProps } from "@/features/inPlaceEdit";
import {
  formatIntlDate,
  isUndefined,
  usePermissionsAccess,
} from "@/shared/libs";
import { Button, LoadingOverlay } from "@/shared/ui";

export function ProfileScreen() {
  const { updateUser } = useUpdateUser();
  const [user, setUser] = useState<DomainUser | undefined>(undefined);
  const { fetchUserByAuthToken, loading } = useFetchUserByAuthToken();
  const { permissionKeys } = usePermissionsAccess();

  // TODO: debug-only helper — logs the authorized user's permission keys.
  const handleLogPermissions = () => {
    const keys = [...permissionKeys].sort();
    console.log(`[debug] permission keys (${keys.length}):`, keys);
  };

  useEffect(() => {
    fetchUserByAuthToken().then(setUser);
  }, []);

  const nameSettings: InPlaceEditProps<string | undefined> = {
    id: "fullName",
    value: user?.user?.fullName,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: async (value) => {
      return updateUser({
        userId: user?.user?.id!,
        body: {
          fullName: value,
        },
      })
        .then(fetchUserByAuthToken)
        .then(setUser);
    },
  };

  if (isUndefined(user) || loading) return <LoadingOverlay />;

  return (
    <>
      <div className="my-[15px] flex items-center">
        <div className="bg-muted mr-8 flex h-30 w-30 shrink-0 items-center justify-center rounded-full">
          <User className="text-brand-500 h-20 w-20" />
        </div>
        <div className="w-full flex-1">
          <div className="flex items-center">
            <span className="mr-4 text-2xl font-semibold">Hello,</span>
            <InPlaceEdit {...nameSettings} className="w-full break-all" />
          </div>
          <div className="text-muted-foreground flex items-center gap-1 text-lg font-semibold">
            <Mail className="h-5 w-5" />
            {user?.user?.email}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <CalendarDays className="h-4 w-4" />
        Together with us since {formatIntlDate(user?.createdAt!, "date")}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={handleLogPermissions}
      >
        Log permissions to console
      </Button>

      <div className="py-6">
        <p className="text-muted-foreground my-4 text-lg text-balance">
          Welcome to <b>TWINS</b> – Your Digital Business Operating System
        </p>
        <p className="text-muted-foreground w-1/2 text-balance">
          Transform the way your organization manages information, processes,
          and collaboration. TWINS is a cloud-based platform that enable
          companies to model their business domain, automate workflows, and
          organize data in a way that perfectly reflects their real-world
          operations. Instead of adapting your business to software limitations,
          TWINS adapts to your business.
        </p>
        <p className="text-muted-foreground my-2 w-2/3 text-balance">
          Create custom entities, define statuses and workflows, manage
          relationships between objects, and automate routine operations — all
          from a single platform designed for flexibility and growth. Whether
          you're building a project management solution, ERP system, marketplace
          integration, service platform, or an entirely unique business
          application, TWINS provides the technology foundation to make it
          happen. One platform. Unlimited business models.
        </p>
      </div>
    </>
  );
}
