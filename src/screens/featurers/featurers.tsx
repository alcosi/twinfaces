import { useFeaturersSearch } from "@/entities/featurer";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { FieldTyperTable } from "./tables/field-typer-table";

export function FeaturersScreen() {
  const { searchFeaturers } = useFeaturersSearch();

  async function fetchFeaturers(pagination: PaginationState, options: {}) {
    try {
      return await searchFeaturers({ pagination, options: {} });
    } catch (error) {
      toast.error("An error occured while featurers: " + error);
      throw new Error("An error occured while featurers:" + error);
    }
  }

  return (
    <>
      <FieldTyperTable fetcher={fetchFeaturers} />
    </>
  );
}
