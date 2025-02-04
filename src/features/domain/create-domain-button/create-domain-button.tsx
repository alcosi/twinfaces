import { SidebarMenuButton } from "@/shared/ui";
import { Plus } from "lucide-react";
import { useQuickView } from "../../quick-view-overlay";
import { CreateDomainForm } from "./create-domain-form";

export function CreateDomainButton() {
  const { openQuickView } = useQuickView();

  return (
    <SidebarMenuButton onClick={() => openQuickView(<CreateDomainForm />)}>
      <Plus className="size-4" /> Create domain
    </SidebarMenuButton>
  );
}
