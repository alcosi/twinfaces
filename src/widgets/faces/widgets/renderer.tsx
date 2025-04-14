import { FC } from "react";

import {
  Face_DETAILED,
  fetchFaceById,
  fetchUserPermissionListById,
  getAuthTokenFromCookies,
} from "@/entities/face";
import { Permission } from "@/entities/permission";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString, safe } from "@/shared/libs";
import { RedirectButton } from "@/shared/ui";

import { AlertError } from "../components";
import { TWidgetFaceProps, Widget, WidgetFaceProps } from "./types";
import { TW001, TW002, TW004, WT001 } from "./views";

const WIDGETS: Record<string, FC<WidgetFaceProps>> = {
  WT001,
};

const TWIDGETS: Record<string, FC<TWidgetFaceProps>> = {
  TW001,
  TW002,
  TW004,
};

type Props = {
  twinId?: string;
  widget: Widget;
};

export async function WidgetRenderer({ twinId, widget }: Props) {
  const faceResult = await safe(() =>
    fetchFaceById<Face_DETAILED>(widget.widgetFaceId!, {
      query: { showFaceMode: "DETAILED" },
    })
  );

  const authToken = await getAuthTokenFromCookies();

  const userPermissionList = await safe(() =>
    fetchUserPermissionListById<Permission[]>(authToken, {
      query: { showPermissionMode: "DETAILED" },
    })
  );

  if (!faceResult.ok) {
    return (
      <AlertError
        key={widget.widgetFaceId}
        title="Widget failed to load"
        message={(faceResult.error as Error)?.message}
      />
    );
  }

  const face = faceResult.data;
  const componentName = face.component;

  if (!userPermissionList.ok) {
    return (
      <AlertError message="Failed to load user permission. Try again later" />
    );
  }

  const isPermissionDomainManaged = userPermissionList.data.some(
    (el) => el.key === "DOMAIN_MANAGE"
  );

  if (isPopulatedString(componentName) && componentName in WIDGETS) {
    const Comp = WIDGETS[componentName as keyof typeof WIDGETS]!;
    return <Comp face={face} widget={widget} />;
  }

  if (isPopulatedString(componentName) && componentName in TWIDGETS) {
    const Comp = TWIDGETS[componentName]!;

    if (!twinId) {
      return (
        <AlertError
          key={widget.widgetFaceId}
          title="Missing twinId"
          message={`Component "${componentName}" requires twinId but it was not provided.`}
        />
      );
    }

    return (
      <>
        {isPermissionDomainManaged && (
          <RedirectButton linkHref={`/${PlatformArea.core}/twins/${twinId}`} />
        )}

        <Comp twinId={twinId} face={face} widget={widget} />
      </>
    );
  }

  return (
    <AlertError
      key={widget.widgetFaceId}
      title="Unsupported widget"
      message={`Component "${componentName}" is not supported.`}
    />
  );
}
