import { CircleUserRound, MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";

import { Comment_DETAILED } from "@/entities/comment";
import { formatIntlDate, isPopulatedArray } from "@/shared/libs";
import {
  Avatar,
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  GuidWithCopy,
} from "@/shared/ui";

import { UserResourceLink } from "../../../features/user/ui";

type CommentCardProps = {
  item: Comment_DETAILED;
  /**
   * Optional slot rendered in the card header — e.g. a link to the twin the
   * comment belongs to. Injected by the caller (a widget) so this feature
   * stays free of cross-feature imports.
   */
  twinSlot?: ReactNode;
};

export function CommentCard({ item, twinSlot }: CommentCardProps) {
  return (
    <Card className="group hover:border-brand-500/30 w-full p-4 transition-colors">
      <div className="flex gap-3">
        {item.authorUser?.avatar ? (
          <Avatar
            url={item.authorUser.avatar}
            alt={item.authorUser.fullName ?? "Avatar"}
            size="lg"
            className="h-9 w-9 rounded-full"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <CircleUserRound className="h-5 w-5" />
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-foreground text-sm font-semibold">
                <UserResourceLink
                  data={item.authorUser}
                  withTooltip
                  hideAvatar
                />
              </span>

              {item.createdAt && (
                <span className="text-muted-foreground text-xs">
                  {formatIntlDate(item.createdAt, "datetime-local")}
                </span>
              )}

              {twinSlot && (
                <div className="inline-flex max-w-48">{twinSlot}</div>
              )}

              {item.id && (
                <span className="text-muted-foreground text-xs">
                  <GuidWithCopy value={item.id} />
                </span>
              )}
            </div>

            {isPopulatedArray(item.commentActions) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="iconSm"
                    variant="ghost"
                    className="text-muted-foreground shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                  >
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="min-w-32">
                  {item.commentActions?.map((action, index) => (
                    <DropdownMenuItem key={index} className="capitalize">
                      {action.toLowerCase()}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <p className="text-foreground/90 text-sm leading-relaxed break-words whitespace-pre-wrap">
            {item.text}
          </p>
        </div>
      </div>
    </Card>
  );
}
