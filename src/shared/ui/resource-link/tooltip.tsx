"use client";

import { Copy, Link } from "lucide-react";
import React, {
  ElementType,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { toast } from "sonner";

import { stopPropagation } from "@/shared/libs";
import { Button } from "@/shared/ui/button";
import {
  EntityCardField,
  EntityCardFooter,
  EntityCardHeader,
  EntityCardSection,
} from "@/shared/ui/entity-card";

export const RESOURCE_LINK_TOOLTIP_DELAY_MS = 500;

export type ResourceLinkTooltipProps = PropsWithChildren<{
  uuid: string;
  link?: string;
  actions?: ReactNode;
}>;

/**
 * The entity's own actions — the duplicate/export menu. Handed to the root but
 * drawn in the header's corner, the way the graph cards carry their menu, so
 * it travels to the header through context rather than through every tooltip.
 */
const ActionsContext = createContext<ReactNode>(null);

export function ResourceLinkTooltip({
  uuid,
  link,
  actions,
  children,
}: ResourceLinkTooltipProps) {
  function handleCopyUUID(e: React.MouseEvent) {
    stopPropagation(e);
    navigator.clipboard.writeText(uuid).then(() => {
      toast.message("UUID is copied");
    });
  }

  function handleCopyLink(e: React.MouseEvent) {
    stopPropagation(e);
    const baseUrl = window?.location.origin ?? "";
    // Ensure there are no double slashes in the constructed URL
    const text = `${baseUrl}/${link}`.replace(/([^:]\/)\/+/g, "$1");
    navigator.clipboard.writeText(text).then(() => {
      toast.message("Link is copied");
    });
  }

  // The app's entity card, the same one the graphs and the table card view
  // draw: header, sections under hairlines, the copy buttons at the bottom.
  // The frame itself — background, border, radius — is the tooltip's own.
  return (
    <div className="w-72 text-xs" onClick={(e) => e.stopPropagation()}>
      <ActionsContext.Provider value={actions}>
        {children}
      </ActionsContext.Provider>

      <EntityCardFooter>
        <Button
          variant="outline"
          size="xs"
          className="hover:bg-secondary flex min-w-0 flex-1 flex-row items-center gap-1 p-0.5"
          onClick={handleCopyUUID}
        >
          <Copy className="h-3.5 w-3.5" />
          Copy UUID
        </Button>
        <Button
          variant="outline"
          size="xs"
          className="hover:bg-secondary flex min-w-0 flex-1 flex-row items-center gap-1 p-0.5"
          onClick={handleCopyLink}
          disabled={!link}
        >
          <Link className="h-3.5 w-3.5" />
          Copy Link
        </Button>
      </EntityCardFooter>
    </div>
  );
}

type HeaderProps = {
  title: string;
  subTitle?: string;
  iconSource?: ReactNode | ElementType;
};

ResourceLinkTooltip.Header = function Header({
  title,
  subTitle,
  iconSource,
}: HeaderProps) {
  const actions = useContext(ActionsContext);

  return (
    <EntityCardHeader
      title={title}
      subtitle={subTitle}
      icon={iconSource}
      actions={actions}
    />
  );
};

type MainProps = PropsWithChildren<{}>;

/** A section with no caption — the tooltip's details block. */
ResourceLinkTooltip.Main = function Main({ children }: MainProps) {
  return (
    <EntityCardSection className="text-foreground space-y-1">
      {children}
    </EntityCardSection>
  );
};

/** A captioned section — a list, or a parameter with values of its own. */
ResourceLinkTooltip.Section = EntityCardSection;

type ItemProps = PropsWithChildren<{
  title?: string;
}>;

ResourceLinkTooltip.Item = function Item({ title, children }: ItemProps) {
  if (!title) {
    return (
      <div className="flex min-w-0 flex-wrap items-center gap-1">
        {children}
      </div>
    );
  }

  return (
    <EntityCardField label={title} labelWidth={88}>
      {children}
    </EntityCardField>
  );
};
