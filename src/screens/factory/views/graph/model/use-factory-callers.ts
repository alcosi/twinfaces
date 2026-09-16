import { useCallback, useState } from "react";

import { useFactoryBranchesSearch } from "@/entities/factory-branch";
import { useFactoryPipelineSearch } from "@/entities/factory-pipeline";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";

import { GraphChip } from "./types";

/**
 * How many callers one request brings back. A factory reached from more than
 * this many pipelines or branches shows the first of them — the block is a hint
 * about where a factory is used, not an exhaustive index.
 */
const CALLERS_PAGE_SIZE = 200;

/**
 * Loads the "Called From" block of the advanced cards.
 *
 * The cascade only ever walks downwards, so it can name the callers of the
 * factories it descends into but never those of the factory the tab is open on.
 * `nextFactoryIdList` filters the pipeline and branch searches by exactly this
 * relation, so two requests cover every factory the canvas draws.
 */
export function useFactoryCallers() {
  const { searchFactoryPipelines } = useFactoryPipelineSearch();
  const { searchFactoryBranches } = useFactoryBranchesSearch();
  const [callers, setCallers] = useState<Map<string, GraphChip[]> | undefined>(
    undefined
  );

  const fetchCallers = useCallback(
    async (factoryIds: string[]) => {
      if (factoryIds.length === 0) {
        setCallers(new Map());
        return;
      }

      const pagination = { pageIndex: 0, pageSize: CALLERS_PAGE_SIZE };
      const filters = { nextFactoryIdList: factoryIds };

      const [pipelines, branches] = await Promise.all([
        searchFactoryPipelines({ pagination, filters }),
        searchFactoryBranches({ pagination, filters }),
      ]);

      const next = new Map<string, GraphChip[]>();

      function add(factoryId: string | undefined, chip: GraphChip) {
        if (!isPopulatedString(factoryId)) return;
        next.set(factoryId, [...(next.get(factoryId) ?? []), chip]);
      }

      pipelines.data.forEach((pipeline) =>
        add(pipeline.nextFactoryId, {
          id: `caller:pipeline:${pipeline.id}`,
          kind: "pipeline",
          label: isPopulatedString(pipeline.description)
            ? pipeline.description
            : "Pipeline",
          href: `/${PlatformArea.core}/pipelines/${pipeline.id}`,
          inactive: pipeline.active === false,
        })
      );

      branches.data.forEach((branch) =>
        add(branch.nextFactoryId, {
          id: `caller:branch:${branch.id}`,
          kind: "branch",
          label: isPopulatedString(branch.description)
            ? branch.description
            : "Branch",
          href: `/${PlatformArea.core}/branches/${branch.id}`,
          inactive: branch.active === false,
        })
      );

      setCallers(next);
    },
    [searchFactoryPipelines, searchFactoryBranches]
  );

  return { callers, fetchCallers };
}
