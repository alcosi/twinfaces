// "use client";

// import React, { useEffect } from "react";
// import { Toaster } from "sonner";

// import { DomainUser_DETAILED } from "@/entities/user";
// import { PrivateApiContextProvider } from "@/features/api";
// import { useAuthUser } from "@/features/auth";
// import { QuickViewProvider } from "@/features/quick-view-overlay";
// import { TooltipProvider } from "@/shared/ui";

// import { SidebarLayout } from "../sidebar-layout";

// type AuthUser = {
//   domainUser?: DomainUser_DETAILED;
//   authToken: string;
//   domainId: string;
// };

// export function PrivateLayoutProvidersClient({
//   children,
//   initialAuthUser,
// }: {
//   children: React.ReactNode;
//   initialAuthUser: AuthUser;
// }) {
//   const { setAuthUser } = useAuthUser();

//   useEffect(() => {
//     setAuthUser(initialAuthUser);
//   }, [initialAuthUser, setAuthUser]);

//   return (
//     <PrivateApiContextProvider>
//       <QuickViewProvider>
//         <TooltipProvider delayDuration={700} skipDelayDuration={0}>
//           <SidebarLayout>{children}</SidebarLayout>
//           <Toaster />
//         </TooltipProvider>
//       </QuickViewProvider>
//     </PrivateApiContextProvider>
//   );
// }
