import { CircleUserRound, EllipsisVertical } from "lucide-react";

import { Comment_DETAILED } from "@/entities/comment";
import { formatIntlDate, isPopulatedArray } from "@/shared/libs";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";

import { UserResourceLink } from "../../../features/user/ui";

type CommentCardProps = {
  item: Comment_DETAILED;
};

export function CommentCard({ item }: CommentCardProps) {
  return (
    <Card className="mb-2 w-auto" key={item.id}>
      <CardHeader>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            {item.authorUser?.avatar ? (
              <Avatar url={item.authorUser?.avatar} alt="Logo" size="lg" />
            ) : (
              <CircleUserRound className="h-9 w-9" />
            )}

            <h2 className="text-base font-semibold">
              <UserResourceLink data={item.authorUser} withTooltip hideAvatar />
            </h2>
            <span className="text-xs text-gray-500">
              {formatIntlDate(item.createdAt!, "datetime-local")}
            </span>
          </div>

          {isPopulatedArray(item.commentActions) && (
            <Popover>
              <PopoverTrigger className="flex" asChild>
                <Button size="iconSm" variant="outline">
                  <EllipsisVertical />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto">
                <div className="flex flex-col items-start gap-2">
                  {item.commentActions?.map((item, index) => (
                    <button key={index} className="text-black-500 mr-2.5">
                      {item}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardHeader>
      <CardContent className="break-words">{item.text}</CardContent>
    </Card>
  );
}
