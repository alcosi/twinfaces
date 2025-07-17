import { fetchTW002Face, getAuthHeaders } from "@/entities/face";
import { fetchTwinById } from "@/entities/twin/server";
import { cn, isPopulatedArray, safe } from "@/shared/libs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui";

import { StatusAlert } from "../../components";
import { TWidgetFaceProps } from "../types";

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
    return (
      <StatusAlert variant="error" message="Widget TW002 failed to load." />
    );
  }

  const twinResult = await safe(() =>
    fetchTwinById(twidgetResult.data.widget?.pointedTwinId!, {
      header,
      query,
    })
  );

  if (!twinResult.ok) {
    return (
      <StatusAlert variant="warn" message="Failed to load twin for TW002" />
    );
  }

  if (!isPopulatedArray(twidgetResult.data.widget?.accordionItems)) {
    return (
      <StatusAlert
        variant="warn"
        message="No accordionItems defined for TW002"
      />
    );
  }

  return (
    <Accordion type="single" collapsible className={cn("w-full")}>
      <AccordionItem key={0} value="0">
        <AccordionTrigger>Default</AccordionTrigger>
        <AccordionContent>
          <p>{JSON.stringify(twidgetResult.data.widget.accordionItems)}(</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
