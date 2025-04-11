export type MediaType = "image" | "video" | "text" | "pdf" | "unknown";

export type MediaItem = {
  id: string;
  type: MediaType;
  url: string;
  title?: string;
  content?: string;
};
