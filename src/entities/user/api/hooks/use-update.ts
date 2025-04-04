import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { UserUpdateRq } from "../types";

export function useUpdateUser() {
  const api = useContext(PrivateApiContext);

  async function updateUser({
    userId,
    body,
  }: {
    userId: string;
    body: UserUpdateRq;
  }) {
    const { error } = await api.user.update({
      id: userId,
      body,
    });

    if (error) {
      throw new Error("Failed to update user due to API error", error);
    }
  }

  return { updateUser };
}
