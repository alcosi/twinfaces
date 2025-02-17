import { Comment_DETAILED } from "@/entities/comment";
import { SelectAdapter } from "@/shared/libs";

export function useCommentSelectAdapter(): SelectAdapter<Comment_DETAILED> {
  async function getById(id: string) {
    // TODO: Apply valid logic here
    return { id } as Comment_DETAILED;
  }

  async function getItems(search: string) {
    // TODO: Apply valid logic here
    return [];
  }

  function renderItem({ text }: Comment_DETAILED) {
    return text;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
