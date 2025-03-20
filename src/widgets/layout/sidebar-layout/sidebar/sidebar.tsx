"use client";

import { ChevronUp, ChevronsUpDown, Globe, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DomainView_SHORT, useDomains } from "@/entities/domain";
import { FaceNB001 } from "@/entities/face";
import { useAuthUser } from "@/features/auth";
import { CreateDomainButton } from "@/features/domain";
import { PlatformArea } from "@/shared/config";
import {
  Accordion,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  QuestionMarkIcon,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Tabs,
  TabsContent,
} from "@/shared/ui";

import { AccordionGroupSection } from "./accordion-group";
import { PlatformAreaSwitcher } from "./area-switcher";
import { SIDEBAR_GROUPS } from "./constants";

type Props = {
  face: FaceNB001;
};

export function AppSidebar({ face }: Props) {
  const { data } = useDomains();
  const { authUser, updateUser, logout } = useAuthUser();
  const currentDomain = data?.find((i) => i.id === authUser?.domainId);
  const router = useRouter();
  const [area, setArea] = useState<keyof typeof PlatformArea>(
    PlatformArea.workspace
  );

  function onDomainSwitch(domain: DomainView_SHORT) {
    updateUser({ domainId: domain.id });

    // Reload the page to apply changes (e.g., re-fetching data using the new domainId)
    // TODO: Replace reload with context/state management to avoid full page reloads.
    window.location.reload();
  }

  function onLogout() {
    logout();
    router.replace("/");
  }

  return (
    <nav>
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-16 items-center justify-center border-b">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Globe className="h-4 w-4" />
                    {currentDomain?.key ?? "Select Domain"}
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                  <>
                    {data?.map((domain) => (
                      <DropdownMenuItem
                        key={domain.id}
                        disabled={domain.id === currentDomain?.id}
                        onClick={() => onDomainSwitch(domain)}
                      >
                        <span>{domain.key}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <CreateDomainButton />
                  </>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <Tabs value={area} className="flex flex-col gap-2 h-full">
            <section className="grow overflow-y-auto pb-2">
              <TabsContent value={PlatformArea.workspace}>
                <nav className="p-2">
                  {face.userAreaMenuItems?.map((item) => (
                    <Link
                      key={item.key}
                      href={`/${PlatformArea.workspace}/${item.key!}`}
                    >
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton>
                            {item.icon ? (
                              <Image
                                src={item.icon}
                                alt={item.label || "icon"}
                                width={16}
                                height={16}
                                className="dark:invert"
                              />
                            ) : (
                              <QuestionMarkIcon />
                            )}
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </Link>
                  ))}
                </nav>
              </TabsContent>
              <TabsContent value={PlatformArea.core} className="">
                <nav>
                  <Accordion
                    type="single"
                    // value="class"
                    collapsible
                    className="w-full p-2"
                  >
                    <AccordionGroupSection
                      title={SIDEBAR_GROUPS.class.title}
                      items={SIDEBAR_GROUPS.class.items}
                    />
                    <AccordionGroupSection
                      title={SIDEBAR_GROUPS.twin.title}
                      items={SIDEBAR_GROUPS.twin.items}
                    />
                    <AccordionGroupSection
                      title={SIDEBAR_GROUPS.user.title}
                      items={SIDEBAR_GROUPS.user.items}
                    />
                    <AccordionGroupSection
                      title={SIDEBAR_GROUPS.datalist.title}
                      items={SIDEBAR_GROUPS.datalist.items}
                    />
                    <AccordionGroupSection
                      title={SIDEBAR_GROUPS.permission.title}
                      items={SIDEBAR_GROUPS.permission.items}
                    />
                    <AccordionGroupSection
                      title={SIDEBAR_GROUPS.factory.title}
                      items={SIDEBAR_GROUPS.factory.items}
                    />
                    <AccordionGroupSection
                      title={SIDEBAR_GROUPS.transition.title}
                      items={SIDEBAR_GROUPS.transition.items}
                    />
                    <AccordionGroupSection
                      title={SIDEBAR_GROUPS.businessAccount.title}
                      items={SIDEBAR_GROUPS.businessAccount.items}
                    />
                    <AccordionGroupSection
                      title={SIDEBAR_GROUPS.misc.title}
                      items={SIDEBAR_GROUPS.misc.items}
                    />
                  </Accordion>

                  {/* <GroupSection group={SIDEBAR_GROUPS.class} />
                  <GroupSection group={SIDEBAR_GROUPS.twin} />
                  <GroupSection group={SIDEBAR_GROUPS.user} />
                  <GroupSection group={SIDEBAR_GROUPS.datalist} />
                  <GroupSection group={SIDEBAR_GROUPS.permission} />
                  <GroupSection group={SIDEBAR_GROUPS.factory} />
                  <GroupSection group={SIDEBAR_GROUPS.transition} />
                  <GroupSection group={SIDEBAR_GROUPS.businessAccount} />
                  <GroupSection group={SIDEBAR_GROUPS.misc} /> */}
                </nav>
              </TabsContent>
            </section>

            <PlatformAreaSwitcher
              userLabel={face.userAreaLabel ?? ""}
              adminLabel={face.adminAreaLabel ?? ""}
              area={area}
              setArea={setArea}
            />
          </Tabs>
        </SidebarContent>

        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {authUser?.domainUser?.user.fullName}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <SidebarMenuButton onClick={onLogout}>
                      Log out
                    </SidebarMenuButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </nav>
  );
}
