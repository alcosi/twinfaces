import { fetchWT005Face, getAuthHeaders } from "@/entities/face";
import { fetchTwinById } from "@/entities/twin/server";
import { cn, isPopulatedArray, safe } from "@/shared/libs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui";

import { StatusAlert } from "../../components";
import { WidgetFaceProps } from "../types";

export async function WT005(props: WidgetFaceProps) {
  const { twinId, widget } = props;
  const header = await getAuthHeaders();
  const query = {
    showTwinFieldCollectionMode: "SHOW",
    showTwinFieldCollectionFilterEmptyMode: "ANY",
  } as const;

  const widgetResult = await safe(() =>
    fetchWT005Face(widget.widgetFaceId, twinId)
  );

  if (!widgetResult.ok) {
    return (
      <StatusAlert variant="error" message="Widget WT005 failed to load." />
    );
  }

  const twinResult = await safe(() =>
    fetchTwinById(widgetResult.data.widget?.pointedTwinId!, {
      header,
      query,
    })
  );

  if (!twinResult.ok) {
    return (
      <StatusAlert variant="warn" message="Failed to load twin for WT005" />
    );
  }

  if (!isPopulatedArray(widgetResult.data.widget?.accordionItems)) {
    return (
      <StatusAlert
        variant="warn"
        message="No accordionItems defined for WT005"
      />
    );
  }

  return (
    <Accordion type="single" collapsible className={cn("w-full")}>
      <AccordionItem key={0} value="0">
        <AccordionTrigger>Default</AccordionTrigger>
        <AccordionContent>
          <p>{JSON.stringify(widgetResult.data.widget.accordionItems)}(</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
