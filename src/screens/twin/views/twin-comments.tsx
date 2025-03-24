import { PaginationState } from "@tanstack/table-core";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  CommentCard,
  CommentView_DETAILED,
  useFetchComments,
} from "@/entities/comment";
import { TwinContext } from "@/features/twin";
import { PagedResponse } from "@/shared/api";

export function TwinComments() {
  const { twin } = useContext(TwinContext);
  const { fetchCommentsByTwinId } = useFetchComments();
  const [commentsData, setCommentsData] = useState<CommentView_DETAILED[]>();

  useEffect(() => {
    fetchComments({ pageIndex: 0, pageSize: 10 });
  }, []);

  async function fetchComments(
    pagination: PaginationState
  ): Promise<PagedResponse<CommentView_DETAILED>> {
    if (!twin?.id) {
      toast.error("Twin ID is missing");
      return { data: [], pagination: {} };
    }

    try {
      const response = await fetchCommentsByTwinId({
        twinId: twin?.id,
        pagination,
      });

      setCommentsData(response.data);
      return { data: response.data, pagination: response.pagination };
    } catch (error) {
      toast.error("Failed to fetch twin comments");
      return { data: [], pagination: {} };
    }
  }

  return (
    <div className="py-10">
      {commentsData?.map((item) => <CommentCard item={item} key={item.id} />)}
    </div>
  );
}
