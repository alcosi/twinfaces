"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Comment_DETAILED,
  useCommentSearchConfigured,
} from "@/entities/comment";
import { CommentCard } from "@/features/comment/ui";
import { Button, Skeleton } from "@/shared/ui";

const PAGE_SIZE = 10;

type Props = {
  title: string;
  searchId: string;
  twinId: string;
};

export function WT008Client({ title, searchId, twinId }: Props) {
  const { searchCommentsConfigured } = useCommentSearchConfigured();
  const [comments, setComments] = useState<Comment_DETAILED[]>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const loadPage = useCallback(
    async (page: number) => {
      setLoading(true);
      setFailed(false);
      try {
        const result = await searchCommentsConfigured({
          searchId,
          params: { twinId },
          pagination: { pageIndex: page, pageSize: PAGE_SIZE },
        });
        setComments((prev) =>
          page === 0 ? result.data : [...prev, ...result.data]
        );
        setTotal(result.pagination.total ?? 0);
        setPageIndex(page);
      } catch {
        setFailed(true);
      } finally {
        setLoading(false);
      }
    },
    [searchCommentsConfigured, searchId, twinId]
  );

  useEffect(() => {
    loadPage(0);
  }, [loadPage]);

  const hasMore = comments.length < total;

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-base font-bold">{title}</h3>

      {failed && (
        <p className="text-destructive text-sm">Failed to load comments.</p>
      )}

      {!failed && !loading && comments.length === 0 && (
        <p className="text-muted-foreground text-sm">No comments yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <CommentCard key={comment.id} item={comment} />
        ))}
        {loading &&
          Array.from({ length: comments.length === 0 ? 3 : 1 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
      </div>

      {hasMore && !loading && (
        <Button
          variant="outline"
          size="sm"
          className="self-center"
          onClick={() => loadPage(pageIndex + 1)}
        >
          Show more
        </Button>
      )}
    </section>
  );
}
