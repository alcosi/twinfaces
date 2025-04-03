import { fetchTW002Face, getAuthHeaders } from "@/entities/face";
import { fetchTwinById } from "@/entities/twin/server";
import { capitalize, cn, isTruthy, safe } from "@/shared/libs";
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
  const { twinId, widget } = props;
  const header = await getAuthHeaders();
  const query = {
    showTwinFieldCollectionMode: "ALL_FIELDS",
  } as const;

  const twidgetResult = await safe(() =>
    fetchTW002Face(widget.widgetFaceId, twinId)
  );

  if (!twidgetResult.ok) {
    return <AlertError message="Widget TW002 failed to load." />;
  }

  const twinResult = await safe(() =>
    fetchTwinById(twidgetResult.data?.pointedTwinId!, { header, query })
  );

  if (!twinResult.ok) {
    return <AlertError message="Failed to load twin." />;
  }

  if (!twinResult.data?.fields?.translation) {
    return null;
  }

  const parseTranslation = JSON.parse(twinResult.data?.fields?.translation);

  const translationData: TranslationEntry[] = Object.entries(
    parseTranslation
  ).map(([language, description]) => ({
    language,
    description: String(description),
  }));

  return (
    <>
      {isTruthy(translationData) && (
        <Accordion
          type="single"
          collapsible
          className={cn("w-full", widgetGridClasses(widget))}
          defaultValue={translationData?.[0]?.language ?? ""}
        >
          {translationData.map((el, key) => {
            return (
              <AccordionItem key={key} value={el.language ?? ""}>
                <AccordionTrigger>{capitalize(el.language)}</AccordionTrigger>
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
