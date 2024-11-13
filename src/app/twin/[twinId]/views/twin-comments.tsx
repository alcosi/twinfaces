import React, { useContext, useRef, useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import {
  CrudDataTable,
  FiltersState,
} from "@/components/base/data-table/crud-data-table";
import { toast } from "sonner";
import { TwinContext } from "@/app/twin/[twinId]/twin-context";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { Card, CardContent, CardHeader } from "@/components/base/card";
import { Avatar } from "@/shared/ui";
import { CommentView } from "@/entities/twin";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/popover";
import { Button } from "@/components/base/button";
import { CopyButton } from "@/components/base/copy-button";

import { CircleUserRound, EllipsisVertical } from "lucide-react";
import { ApiContext } from "@/shared/api";

const columns: ColumnDef<CommentView>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
  },
  {
    accessorKey: "authorUserId",
    header: "Author",
    cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
  },
  {
    accessorKey: "text",
    header: "Text",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt
        ? new Date(original.createdAt).toLocaleDateString()
        : "",
  },
];

export function TwinComments() {
  const api = useContext(ApiContext);
  const { twin } = useContext(TwinContext);
  const tableRefForward = useRef<DataTableHandle>(null);

  const [commentsData, setCommentsData] = useState<CommentView[]>();

  async function fetchComments(_: PaginationState, filters: FiltersState) {
    if (!twin?.id) {
      toast.error("Twin ID is missing");
      return { data: [], pageCount: 0 };
    }

    try {
      const response = await api.twin.getComments({ id: twin.id });
      const data = response.data;

      if (!data || data.status != 0) {
        console.error("failed to fetch twin comments", data);
        let message = "Failed to load twin comments";
        if (data?.msg) message += `: ${data.msg}`;
        toast.error(message);
        return { data: [], pageCount: 0 };
      }
      setCommentsData(data?.comments);
      return {
        data: data?.comments || [],
        pageCount: 0,
      };
    } catch (e) {
      console.error(`Failed to fetch twin comments`, e);
      toast.error(`Failed to fetch twin comments`);
      return { data: [], pageCount: 0 };
    }
  }

  return (
    <>
      <div className="mb-10">
        <CrudDataTable
          ref={tableRefForward}
          title="Comments"
          columns={columns}
          getRowId={(row) => row.id!}
          fetcher={(paginationState, filters) =>
            fetchComments(paginationState, filters)
          }
          // createButton={{
          //   enabled: true,
          //   onClick: createLink,
          // }}
          disablePagination={true}
          pageSizes={[10, 20, 50]}
          customizableColumns={{
            enabled: true,
            defaultVisibleKeys: ["id", "authorUserId", "text", "createdAt"],
          }}
        />
      </div>

      {commentsData?.map((item) => <CommentCard item={item} key={item.id} />)}
    </>
  );
}

interface CommentCardProps {
  item: CommentView;
}

export function CommentCard({ item }: CommentCardProps) {
  const displayFields = [
    { label: "ID:", value: item.id },
    { label: "Author:", value: item.authorUserId },
    item.authorUser?.email && {
      label: "Email:",
      value: item.authorUser.email,
      isEmail: true,
    },
  ] as { label: string; value: string; isEmail?: boolean }[];

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
              @{item.authorUser?.fullName}
            </h2>
            <span className="text-xs text-gray-500">
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : ""}
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
                {displayFields
                  .filter(Boolean)
                  .map(({ label, value, isEmail }) => (
                    <div key={label} className="flex items-center">
                      <span className="text-black-500 font-bold mr-2.5">
                        {label}
                      </span>
                      {isEmail ? (
                        <>
                          {value}
                          <CopyButton textToCopy={value} />
                        </>
                      ) : (
                        <ShortGuidWithCopy value={value} />
                      )}
                    </div>
                  ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className={"break-words"}>{item.text}</CardContent>
    </Card>
  );
}
