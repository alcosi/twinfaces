import { CommentView_DETAILED } from "@/entities/comment";
import { formatToTwinfaceDate } from "@/shared/libs";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CopyButton,
  GuidWithCopy,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";
import { CircleUserRound, EllipsisVertical } from "lucide-react";
import { UserResourceLink } from "../../user";

interface CommentCardProps {
  item: CommentView_DETAILED;
}

export function CommentCard({ item }: CommentCardProps) {
  return (
    <Card className="mb-2 w-auto" key={item.id}>
      <CardHeader>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            {item.authorUser?.avatar ? (
              <Avatar url={item.authorUser?.avatar} alt={"Logo"} size="lg" />
            ) : (
              <CircleUserRound className="h-9 w-9" />
            )}

            <h2 className="text-base font-semibold">
              <UserResourceLink data={item.authorUser!} withTooltip withoutAvatar />
            </h2>
            <span className="text-xs text-gray-500">
              {formatToTwinfaceDate(item.createdAt!)}
            </span>
          </div>

          <Popover>
            <PopoverTrigger className="flex" asChild>
              <Button size="iconSm" variant="outline">
                <EllipsisVertical />
              </Button>
            </PopoverTrigger>

            <PopoverContent className={"w-auto"}>
              <div className={"flex flex-col items-start gap-2"}>
                <div key="Id" className="flex items-center">
                  <span className="text-black-500 font-bold mr-2.5">ID</span>
                  <GuidWithCopy value={item.id} />
                </div>

                <div key="Author" className="flex items-center">
                  <span className="text-black-500 font-bold mr-2.5">
                    Author
                  </span>
                  <GuidWithCopy value={item.authorUserId} />
                </div>

                {item.authorUser?.email && (
                  <div key="Email" className="flex items-center">
                    <span className="text-black-500 font-bold mr-2.5">
                      Email
                    </span>
                    {item.authorUser.email}
                    <CopyButton textToCopy={item.authorUser.email} />
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className={"break-words"}>{item.text}</CardContent>
    </Card>
  );
}
