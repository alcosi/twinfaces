import { fetchTW002Face, getAuthHeaders } from "@/entities/face";
import { fetchTwinById } from "@/entities/twin/server";
import { cn, isTruthy, safe } from "@/shared/libs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui";

import { AlertError } from "../../components";
import { widgetGridClasses } from "../../utils";
import { TWidgetFaceProps, TranslationEntry } from "../types";

export async function TW002(props: TWidgetFaceProps) {
  const { twinId, face, widget } = props;
  const header = await getAuthHeaders();
  const query = {
    showTwinFieldCollectionMode: "ALL_FIELDS",
  } as const;

  const result = await safe(() => fetchTW002Face(widget.widgetFaceId, twinId));

  if (!result.ok) {
    return <AlertError message="Widget TW002 failed to load." />;
  }

  const pointedTwin = await safe(() =>
    fetchTwinById(result.data?.pointedTwinId!, { header, query })
  );

  if (!pointedTwin.ok) {
    return <AlertError message="Failed to load twin." />;
  }

  if (!pointedTwin.data?.fields?.translation) {
    return null;
  }

  const parseTranslation = JSON.parse(pointedTwin.data?.fields?.translation);

  const parsedData: TranslationEntry[] = Object.entries(parseTranslation).map(
    ([language, description]) => ({
      language,
      description: String(description),
    })
  );

  return (
    <>
      {isTruthy(parsedData) && (
        <Accordion
          type="single"
          collapsible
          className={cn("w-full", widgetGridClasses(widget))}
          defaultValue={parsedData?.[0]?.language ?? ""}
        >
          {parsedData.map((el, key) => {
            return (
              <AccordionItem key={key} value={el.language ?? ""}>
                <AccordionTrigger>
                  {el.language?.toUpperCase()}
                </AccordionTrigger>
                <AccordionContent>
                  <p>{el.description}</p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </>
  );
}
