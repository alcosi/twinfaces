"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { DomainUser } from "@/entities/user";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";

type Props = {
  currentAuthUser?: DomainUser;
};

export function SidebarLayoutHeader({ currentAuthUser }: Props) {
  const getInitials = (userFullName?: string) => {
    if (!isPopulatedString(userFullName)) return "UN";

    const parts = userFullName.split(" ");

    if (parts.length === 1) return (parts[0]?.[0] ?? "U").toUpperCase();

    return (
      (parts[0]?.[0] ?? "U").toUpperCase() +
      (parts[1]?.[0] ?? "U").toUpperCase()
    );
  };

  return (
    <header className="border-border bg-background sticky top-0 z-15 flex h-16 w-full items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center">
        <Link href={`/${PlatformArea.workspace}/products`}>
          <Image src="/logo.svg" alt="Logo" width={162} height={27} priority />
        </Link>
      </div>

      {currentAuthUser && (
        <Link
          href="/profile"
          className="flex cursor-pointer items-center gap-2 select-none"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F15728]">
            <span className="font-rubik text-[11.2px] leading-[1.2] font-semibold text-white">
              {getInitials(currentAuthUser.user?.fullName)}
            </span>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-dark-gray font-rubik text-sm leading-[1.2] font-semibold">
              {currentAuthUser.user?.fullName}
            </span>
            <span className="text-dark-gray font-rubik text-[11px] leading-[1.3] font-normal">
              {currentAuthUser.user?.email}
            </span>
          </div>
        </Link>
      )}
    </header>
  );
}
