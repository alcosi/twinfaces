"use client";

import { ArrowUp } from "lucide-react";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import {
  Comment_DETAILED,
  useCommentCreate,
  useCommentSearchConfigured,
} from "@/entities/comment";
import { CommentCard } from "@/features/comment/ui";
import { cn } from "@/shared/libs";
import { Button, Skeleton, Textarea } from "@/shared/ui";

const PAGE_SIZE = 10;

// Space taken by the sticky page header and the tab bar above the feed; used
// so that scrolling to a day (or back to the top) does not hide it under them.
const STICKY_OFFSET_CLASS = "scroll-mt-[calc(var(--header-height)+4rem)]";
const STICKY_OFFSET_PX = 128;

type Props = {
  title: string;
  searchId: string;
  twinId: string;
  canComment: boolean;
};

type DayGroup = {
  key: string;
  label: string;
  comments: Comment_DETAILED[];
};

export function WT008Client({ title, searchId, twinId, canComment }: Props) {
  const { searchCommentsConfigured } = useCommentSearchConfigured();
  const [comments, setComments] = useState<Comment_DETAILED[]>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const topRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef(new Map<string, HTMLElement>());

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
  const groups = useMemo(() => groupByDay(comments), [comments]);

  // Infinite scroll: the next page loads once the end of the list comes into
  // view. A failed page stops it until the user retries.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading || failed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) loadPage(pageIndex + 1);
      },
      { rootMargin: "0px 0px 300px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, failed, pageIndex, loadPage]);

  const activeDay = useActiveDay(groups, dayRefs);

  function scrollToDay(key: string) {
    dayRefs.current.get(key)?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section ref={topRef} className={cn("pt-6 pb-10", STICKY_OFFSET_CLASS)}>
      <div className="flex gap-8">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h3 className="text-base font-bold">{title}</h3>

          {canComment && (
            <NewCommentForm twinId={twinId} onCreated={() => loadPage(0)} />
          )}

          {!failed && !loading && comments.length === 0 && (
            <p className="text-muted-foreground text-sm">No comments yet.</p>
          )}

          {groups.map((group) => (
            <section
              key={group.key}
              ref={(node) => {
                if (node) dayRefs.current.set(group.key, node);
                else dayRefs.current.delete(group.key);
              }}
              className={cn("flex flex-col gap-3", STICKY_OFFSET_CLASS)}
            >
              <DaySeparator label={group.label} />
              {group.comments.map((comment) => (
                <CommentCard key={comment.id} item={comment} />
              ))}
            </section>
          ))}

          {loading &&
            Array.from({ length: comments.length === 0 ? 3 : 1 }).map(
              (_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />
            )}

          {failed && (
            <div className="flex items-center justify-center gap-3 py-2">
              <p className="text-destructive text-sm">
                {comments.length === 0
                  ? "Failed to load comments."
                  : "Failed to load more comments."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  loadPage(comments.length === 0 ? 0 : pageIndex + 1)
                }
              >
                Retry
              </Button>
            </div>
          )}

          <div ref={sentinelRef} aria-hidden className="h-px" />
        </div>

        {groups.length > 0 && (
          <DayRail
            groups={groups}
            activeDay={activeDay}
            loaded={comments.length}
            total={total}
            onDayClick={scrollToDay}
            onBackToTop={scrollToTop}
          />
        )}
      </div>
    </section>
  );
}

function DaySeparator({ label }: { label: string }) {
  return (
    <div className="text-muted-foreground flex items-center gap-3 pt-2 text-xs font-medium">
      <span className="bg-border h-px flex-1" />
      <span>{label}</span>
      <span className="bg-border h-px flex-1" />
    </div>
  );
}

/**
 * The timeline beside the feed: one entry per day loaded so far — it grows as
 * more pages load — with the day currently on screen highlighted.
 */
function DayRail({
  groups,
  activeDay,
  loaded,
  total,
  onDayClick,
  onBackToTop,
}: {
  groups: DayGroup[];
  activeDay: string | undefined;
  loaded: number;
  total: number;
  onDayClick: (key: string) => void;
  onBackToTop: () => void;
}) {
  return (
    <aside className="hidden w-44 shrink-0 lg:block">
      <div className="sticky top-[calc(var(--header-height)+4.5rem)] flex max-h-[calc(100vh-var(--header-height)-6rem)] flex-col gap-3">
        <ol className="border-border flex min-h-0 flex-col overflow-y-auto border-l">
          {groups.map((group) => {
            const isActive = group.key === activeDay;
            return (
              <li key={group.key}>
                <button
                  type="button"
                  onClick={() => onDayClick(group.key)}
                  className={cn(
                    "-ml-px flex w-full items-center justify-between gap-2 border-l-2 border-transparent py-1 pr-1 pl-3 text-left text-xs transition-colors",
                    "text-muted-foreground hover:text-foreground",
                    isActive && "border-brand-500 text-brand-600 font-medium"
                  )}
                >
                  <span className="truncate">{group.label}</span>
                  <span className="tabular-nums">{group.comments.length}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="text-muted-foreground flex flex-col gap-2 pl-3 text-xs">
          <span className="tabular-nums">
            {loaded} of {total}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={onBackToTop}
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Back to top
          </Button>
        </div>
      </div>
    </aside>
  );
}

/** The topmost day whose comments are on screen below the sticky header. */
function useActiveDay(
  groups: DayGroup[],
  dayRefs: React.RefObject<Map<string, HTMLElement>>
): string | undefined {
  const [activeDay, setActiveDay] = useState<string>();

  useEffect(() => {
    const visible = new Set<string>();
    const keyByNode = new Map<Element, string>();
    dayRefs.current.forEach((node, key) => keyByNode.set(node, key));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = keyByNode.get(entry.target);
          if (!key) return;
          if (entry.isIntersecting) visible.add(key);
          else visible.delete(key);
        });
        const first = groups.find((group) => visible.has(group.key));
        if (first) setActiveDay(first.key);
      },
      { rootMargin: `-${STICKY_OFFSET_PX}px 0px 0px 0px` }
    );

    keyByNode.forEach((_, node) => observer.observe(node));
    return () => observer.disconnect();
  }, [groups, dayRefs]);

  return activeDay;
}

function groupByDay(comments: Comment_DETAILED[]): DayGroup[] {
  const groups = new Map<string, DayGroup>();

  for (const comment of comments) {
    const date = comment.createdAt ? new Date(comment.createdAt) : undefined;
    const valid = date && !isNaN(date.getTime());
    const key = valid ? toDayKey(date) : "unknown";

    let group = groups.get(key);
    if (!group) {
      group = {
        key,
        label: valid ? formatDayLabel(date) : "No date",
        comments: [],
      };
      groups.set(key, group);
    }
    group.comments.push(comment);
  }

  return [...groups.values()];
}

function toDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatDayLabel(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (toDayKey(date) === toDayKey(today)) return "Today";
  if (toDayKey(date) === toDayKey(yesterday)) return "Yesterday";

  return new Intl.DateTimeFormat(navigator.language, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function NewCommentForm({
  twinId,
  onCreated,
}: {
  twinId: string;
  onCreated: () => void;
}) {
  const { createComment } = useCommentCreate();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const trimmed = text.trim();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      await createComment({ twinId, text: trimmed });
      setText("");
      onCreated();
    } catch {
      toast.error("Failed to add comment.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          // Ctrl/Cmd+Enter sends, plain Enter keeps a new line.
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.currentTarget.form?.requestSubmit();
          }
        }}
        placeholder="Write a comment…"
        disabled={sending}
        rows={3}
      />
      <Button
        type="submit"
        size="sm"
        className="self-end"
        disabled={!trimmed}
        loading={sending}
      >
        Send
      </Button>
    </form>
  );
}
