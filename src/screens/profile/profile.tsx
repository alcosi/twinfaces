"use client";

import {
  Boxes,
  Building2,
  CalendarDays,
  type LucideIcon,
  Mail,
  Rocket,
  Sparkles,
  Terminal,
  User,
} from "lucide-react";
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
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingOverlay,
} from "@/shared/ui";

/** Marketing highlights rendered as feature cards below the identity hero. */
const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Boxes,
    title: "Flexible by Design",
    description:
      "Create custom entities, define statuses and workflows, manage relationships between objects, and automate routine operations — all from a single platform designed for flexibility and growth.",
  },
  {
    icon: Building2,
    title: "Built Around Your Business",
    description:
      "Whether you're managing projects, products, assets, customers, employees, or entirely unique business concepts, TWINS provides the tools to build a system that matches your organization rather than forcing you into predefined structures.",
  },
  {
    icon: Rocket,
    title: "One Platform, Endless Possibilities",
    description:
      "From internal management systems and ERP solutions to marketplaces, service platforms, and industry-specific applications, TWINS provides the technological foundation to support your growth and evolving business needs.",
  },
];

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
    <div className="mx-auto w-full max-w-5xl space-y-8 py-6">
      {/* Identity hero */}
      <Card className="overflow-hidden">
        <div className="from-brand-500/10 via-brand-500/5 to-card bg-gradient-to-br">
          <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
            <div className="bg-card ring-brand-500/20 flex h-28 w-28 shrink-0 items-center justify-center rounded-full shadow-sm ring-4">
              <User className="text-brand-500 h-16 w-16" />
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-2xl font-semibold">Hello,</span>
                <InPlaceEdit {...nameSettings} className="break-all" />
              </div>

              <div className="text-muted-foreground flex items-center gap-2 text-base font-medium">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{user?.user?.email}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Badge variant="secondary" className="gap-1.5 font-medium">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Together with us since{" "}
                  {formatIntlDate(user?.createdAt!, "date")}
                </Badge>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground h-7 gap-1.5 px-2 text-xs"
                  onClick={handleLogPermissions}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  Log permissions to console
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Welcome intro */}
      <section className="space-y-4 text-center">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Your Digital Business Operating System
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome to <span className="text-brand-500">TWINS</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-3xl leading-relaxed text-balance">
          Transform the way your organization manages information, processes,
          and collaboration. TWINS is a cloud-based platform that enables
          companies to model their business domain, automate workflows, and
          organize data in a way that perfectly reflects their real-world
          operations. Instead of adapting your business to software limitations,
          TWINS adapts to your business.
        </p>
      </section>

      {/* Feature cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card
            key={title}
            className="h-full transition-shadow duration-200 hover:shadow-md"
          >
            <CardHeader className="space-y-3 p-5">
              <div className="bg-brand-500/10 text-brand-500 flex h-11 w-11 items-center justify-center rounded-lg">
                <Icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tagline */}
      <div className="from-brand-500/5 to-brand-600/5 border-brand-500/10 rounded-xl border bg-gradient-to-r p-8 text-center">
        <p className="text-xl font-semibold sm:text-2xl">
          One platform.{" "}
          <span className="text-brand-500">Unlimited business models.</span>
        </p>
      </div>
    </div>
  );
}
