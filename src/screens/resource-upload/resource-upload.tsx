"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileUp,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  XCircle,
} from "lucide-react";
import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import {
  Resource,
  ResourceUploadResult,
  useResourceSearchV1,
} from "@/entities/resource";
import { PrivateApiContext } from "@/shared/api";
import { cn, formatIntlDate, generateUUID } from "@/shared/libs";
import { Badge, Button, Input, Progress } from "@/shared/ui";

type UploadStatus = "pending" | "uploading" | "success" | "error";

type UploadItem = {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  /** First entry of the upload response — carries the resource id for viewing. */
  result?: ResourceUploadResult;
  error?: string;
};

const PAGE_SIZE = 20;

function formatBytes(bytes?: number): string {
  if (bytes === undefined || bytes === null) return "—";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** index;
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

/** Public (unauthenticated) file URL served by twins via the app proxy. */
function resourceUrl(resourceId?: string): string | undefined {
  if (!resourceId) return undefined;
  return `/api/proxy/public/resource/${resourceId}/v1`;
}

/**
 * `formatIntlDate` throws on input it can't parse — a crashing formatter must
 * never take down the whole list render, so degrade to the raw value instead.
 */
function safeFormatDate(value?: string): string {
  if (!value) return "—";
  try {
    return formatIntlDate(value, "datetime-local");
  } catch {
    return value;
  }
}

export function ResourceUploadScreen() {
  const api = useContext(PrivateApiContext);
  const { searchResources } = useResourceSearchV1();

  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  //? NOTE Uploaded resources list (search v1)
  const [resources, setResources] = useState<Resource[]>([]);
  const [totalResources, setTotalResources] = useState(0);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);

  const loadResources = useCallback(
    async (page: number, query: string) => {
      setIsLoadingResources(true);
      try {
        const trimmed = query.trim();
        const response = await searchResources({
          pagination: { pageIndex: page, pageSize: PAGE_SIZE },
          //? NOTE The backend applies `originalFileNameLikeList` as a raw SQL
          // LIKE — the caller must provide the `%` wildcards itself.
          filters: trimmed
            ? { originalFileNameLikeList: [`%${trimmed}%`] }
            : undefined,
          sort: { field: "createdAt", direction: "DESC" },
        });
        setResources(response.data);
        setTotalResources(Number(response.pagination.total ?? 0));
      } catch (error) {
        toast.error("Failed to load uploaded resources: " + error);
      } finally {
        setIsLoadingResources(false);
      }
    },
    [searchResources]
  );

  //? NOTE Debounce the search input before hitting the API.
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedQuery(searchQuery);
      setPageIndex(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadResources(pageIndex, appliedQuery);
  }, [loadResources, pageIndex, appliedQuery]);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newItems: UploadItem[] = Array.from(files).map((file) => ({
      id: generateUUID(),
      file,
      status: "pending",
      progress: 0,
    }));
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragCounterRef.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragCounterRef.current = 0;
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) addFiles(event.dataTransfer.files);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) addFiles(event.target.files);
    event.target.value = "";
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function clearFinished() {
    setItems((prev) =>
      prev.filter(
        (item) => item.status === "pending" || item.status === "uploading"
      )
    );
  }

  async function handleUpload() {
    const pending = items.filter((item) => item.status === "pending");
    if (pending.length === 0) return;

    setIsUploading(true);

    let succeeded = 0;
    let failed = 0;

    for (const item of pending) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "uploading", progress: 0 } : i
        )
      );

      try {
        const files = await api.resource.upload({
          file: item.file,
          onProgress: (progress) => {
            setItems((prev) =>
              prev.map((i) => (i.id === item.id ? { ...i, progress } : i))
            );
          },
        });

        succeeded += 1;
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "success",
                  progress: 100,
                  result: files[0],
                }
              : i
          )
        );
      } catch (error) {
        failed += 1;
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : i
          )
        );
      }
    }

    setIsUploading(false);

    if (succeeded > 0) {
      toast.success(`${succeeded} file(s) uploaded`);
      // Re-fetch so freshly uploaded files appear in the list.
      loadResources(pageIndex, appliedQuery);
    }
    if (failed > 0) toast.error(`${failed} file(s) failed to upload`);
  }

  const pendingCount = items.filter((item) => item.status === "pending").length;
  const pageCount = Math.max(1, Math.ceil(totalResources / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-4 p-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            fileInputRef.current?.click();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-border text-muted-foreground flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          isDragging && "border-brand-500 bg-brand-500/10 text-brand-500"
        )}
      >
        <UploadCloud className="h-10 w-10" />
        <p className="text-sm font-medium">
          Drop files here or click to browse
        </p>
        <p className="text-xs">
          POST /private/resource/upload/v1 (multipart/form-data)
        </p>
      </div>

      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const url = resourceUrl(item.result?.resourceId);

            return (
              <div
                key={item.id}
                className="border-border bg-card/50 flex flex-col gap-1.5 rounded-lg border p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="shrink-0">
                    {item.status === "success" && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                    {item.status === "error" && (
                      <XCircle className="text-destructive h-4 w-4" />
                    )}
                    {item.status === "uploading" && (
                      <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                    )}
                    {item.status === "pending" && (
                      <FileUp className="text-muted-foreground h-4 w-4" />
                    )}
                  </span>

                  <span className="truncate text-sm font-medium">
                    {item.file.name}
                  </span>

                  <span className="text-muted-foreground ml-auto shrink-0 text-xs">
                    {formatBytes(item.file.size)}
                  </span>

                  <Badge
                    variant={
                      item.status === "error" ? "destructive" : "secondary"
                    }
                    className="shrink-0 capitalize"
                  >
                    {item.status}
                  </Badge>

                  {item.status === "pending" && !isUploading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      aria-label={`Remove ${item.file.name}`}
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {item.status === "uploading" && (
                  <Progress value={item.progress} className="h-1" />
                )}

                {item.status === "error" && item.error && (
                  <p className="text-destructive truncate text-xs">
                    {item.error}
                  </p>
                )}

                {item.status === "success" && (
                  <div className="flex items-center gap-2">
                    {url ? (
                      <>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 hover:text-brand-500 inline-flex items-center gap-1 text-xs font-medium"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open
                        </a>
                        <a
                          href={url}
                          download={item.result?.originalFileName}
                          className="text-brand-600 hover:text-brand-500 inline-flex items-center gap-1 text-xs font-medium"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                        <span className="text-muted-foreground truncate font-mono text-[11px]">
                          {item.result?.resourceId}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        Uploaded, but the response contains no resource id.
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleUpload}
            disabled={isUploading || pendingCount === 0}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
            Upload{pendingCount > 0 && ` (${pendingCount})`}
          </Button>

          <Button
            variant="outline"
            onClick={clearFinished}
            disabled={isUploading}
          >
            <Trash2 className="h-4 w-4" />
            Clear finished
          </Button>
        </div>
      )}

      <div className="border-border mt-2 flex flex-col gap-2 border-t pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold">
            Uploaded resources
            {totalResources > 0 && (
              <span className="text-muted-foreground ml-1 font-normal">
                ({totalResources})
              </span>
            )}
          </h2>

          <div className="relative ml-auto w-full max-w-64">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by file name…"
              className="h-8 pl-8 text-sm"
              aria-label="Search resources by file name"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Refresh list"
            disabled={isLoadingResources}
            onClick={() => loadResources(pageIndex, appliedQuery)}
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5",
                isLoadingResources && "animate-spin"
              )}
            />
          </Button>
        </div>

        {isLoadingResources && resources.length === 0 ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : resources.length === 0 ? (
          <p className="text-muted-foreground py-2 text-sm">
            {appliedQuery
              ? `No resources match "${appliedQuery}".`
              : "Nothing uploaded yet."}
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {resources.map((resource) => {
              const url = resourceUrl(resource.id);

              return (
                <div
                  key={resource.id}
                  className="hover:bg-muted/50 flex items-center gap-2 rounded-lg px-2 py-1.5"
                >
                  <FileUp className="text-muted-foreground h-4 w-4 shrink-0" />

                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-600 truncate text-sm hover:underline"
                      title={resource.originalFileName}
                    >
                      {resource.originalFileName}
                    </a>
                  ) : (
                    <span className="truncate text-sm">
                      {resource.originalFileName}
                    </span>
                  )}

                  <span className="text-muted-foreground ml-auto shrink-0 text-xs">
                    {safeFormatDate(resource.createdAt)}
                  </span>

                  <span className="text-muted-foreground w-16 shrink-0 text-right text-xs">
                    {formatBytes(resource.sizeInBytes)}
                  </span>

                  {url && (
                    <span className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${resource.originalFileName}`}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        asChild
                      >
                        <a
                          href={url}
                          download={resource.originalFileName}
                          aria-label={`Download ${resource.originalFileName}`}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </span>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pageIndex === 0 || isLoadingResources}
                onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <span className="text-muted-foreground text-xs">
                Page {pageIndex + 1} of {pageCount}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={pageIndex + 1 >= pageCount || isLoadingResources}
                onClick={() => setPageIndex((prev) => prev + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
