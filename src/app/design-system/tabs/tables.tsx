import { useProductFlavorConfig } from "@/shared/config";
import { TwinsTable } from "@/widgets/tables";

import { UiSection } from "../components/ui-section";

export function TablesTab() {
  const { flavor } = useProductFlavorConfig();

  return (
    <div className="h-screen overflow-y-auto max-h-98">
      <div className="space-y-4 p-4">
        <UiSection title="Twin">
          {/* <UiSection.Item
            title="<TwinsTable />"
            value={
              <TwinsTable
                title="Marketplaces"
                twinClassId="8a62c409-82e5-4022-b65a-bdd5c4e5c607"
                enabledColumns={[
                  "id",
                  "aliases",
                  "name",
                  "statusId",
                  "description",
                  "tags",
                  "markers",
                  "createdAt",
                ]}
              />
            }
          /> */}

          <UiSection.Item
            title="<TwinsTable />"
            value={
              <TwinsTable
                title="Products"
                baseTwinClassId={
                  flavor === "twinfaces"
                    ? // ? "3343c2a7-89c4-4545-95ee-aaa89fbd2548" // NEXT-TO-SHELVES
                      "b7e5f969-c45d-44f4-94c8-6d99c2d3bd61" // Shoe
                    : "b1597f7f-ef2c-4305-b6bf-04dad53ae0be" // PRODUCT_ABSTRACT
                }
                enabledColumns={[
                  "id",
                  // "aliases",
                  "name",
                  // "statusId",
                  // "description",
                  // "tags",
                  // "markers",
                  // "createdAt",
                ]}
              />
            }
          />
        </UiSection>
      </div>
    </div>
  );
}
