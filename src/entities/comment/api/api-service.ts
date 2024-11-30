import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createCommentApi(settings: ApiSettings) {
  function search() {
    // TODO: Add implementation
  }

  function getById() {
    // TODO: Add implementation
  }

  function create() {
    // TODO: Add implementation
  }

  function update() {
    // TODO: Add implementation
  }

  return {
    search,
    getById,
    create,
    update,
  };
}

export type CommentApi = ReturnType<typeof createCommentApi>;
