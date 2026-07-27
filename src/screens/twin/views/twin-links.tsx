import { useRouter } from "next/navigation";
import { useContext } from "react";

import { TwinLink_DETAILED } from "@/entities/twin-link";
import { Twin_DETAILED } from "@/entities/twin/server";
import { TwinContext } from "@/features/twin";
import { PlatformArea } from "@/shared/config";
import { TwinLinksTable, TwinsTable } from "@/widgets/tables";

export function TwinLinks() {
  const router = useRouter();
  const { twin } = useContext(TwinContext);

  function handleTwinRowClick(row: Twin_DETAILED) {
    router.push(`/${PlatformArea.core}/twins/${row.id}`);
  }

  // A twin link has no page of its own, so a row navigates to the twin on the
  // other side of the link.
  function resolveLinkedTwinHref(
    row: TwinLink_DETAILED,
    direction: "forward" | "backward"
  ) {
    const linkedTwinId =
      direction === "forward" ? row.dstTwinId : row.srcTwinId;
    return `/${PlatformArea.core}/twins/${linkedTwinId}`;
  }

  return (
    <>
      <TwinLinksTable
        twinId={twin.id!}
        direction="forward"
        title="Forward Links"
        onRowClick={(row) => router.push(resolveLinkedTwinHref(row, "forward"))}
        getRowHref={(row) => resolveLinkedTwinHref(row, "forward")}
      />

      <TwinLinksTable
        twinId={twin.id!}
        direction="backward"
        title="Backward Links"
        onRowClick={(row) =>
          router.push(resolveLinkedTwinHref(row, "backward"))
        }
        getRowHref={(row) => resolveLinkedTwinHref(row, "backward")}
      />

      {twin.subordinates && (
        <TwinsTable
          title="Children"
          baseTwinClassIdList={twin.subordinates.map((el) => el.id)}
          targetHeadTwinId={twin.id}
          onRowClick={handleTwinRowClick}
          getRowHref={(row) => `/${PlatformArea.core}/twins/${row.id}`}
        />
      )}
    </>
  );
}
