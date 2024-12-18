import { AutoField, AutoFormValueType } from "@/components/auto-field";
import { useDatalistSelectAdapter } from "@/entities/datalist";
import { FeaturerTypes } from "@/entities/featurer";
import { useTwinClassSelectAdapter } from "@/entities/twinClass";
import {
  useTwinClassLinkStrengthSelectAdapter,
  useTwinClassLinkTypeSelectAdapter,
} from "@/entities/twinClassLink";
import { useTwinFlowSelectAdapter } from "@/entities/twinFlow";
import { useTwinFlowSchemaSelectAdapter } from "@/entities/twinFlowSchema";
import { useUserSelectAdapter } from "@/entities/user/libs";
import { useUserGroupSelectAdapter } from "@/entities/userGroup/libs/hooks";
import { Form } from "@/shared/ui";
import { FeaturerFormField } from "@/widgets/form-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UiSection } from "../components/ui-section";

export function InputFieldsTab() {
  const tcAdapter = useTwinClassSelectAdapter();
  const uAdapter = useUserSelectAdapter();
  const ugAdapter = useUserGroupSelectAdapter();
  const linkTypeAdapter = useTwinClassLinkTypeSelectAdapter();
  const linkStrengthAdapter = useTwinClassLinkStrengthSelectAdapter();
  const dlAdapter = useDatalistSelectAdapter();
  const tfAdapter = useTwinFlowSelectAdapter();
  const tfsAdapter = useTwinFlowSchemaSelectAdapter();

  const form = useForm<any>({
    resolver: zodResolver(z.any()),
    defaultValues: {},
  });

  return (
    <Form {...form}>
      <form
        className="h-screen overflow-y-auto max-h-98"
        style={{
          maxHeight: "calc(100vh - var(--header-height))",
        }}
      >
        <div className="space-y-4 p-4">
          <UiSection title="Class">
            <UiSection.Item
              title="Class (single)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...tcAdapter,
                  }}
                />
              }
            />
            <UiSection.Item
              title="Class (multi)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...tcAdapter,
                    multi: true,
                  }}
                />
              }
            />
            <UiSection.Item
              title="Link type (single)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...linkTypeAdapter,
                  }}
                />
              }
            />
            <UiSection.Item
              title="Link type (multi)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...linkTypeAdapter,
                    multi: true,
                  }}
                />
              }
            />
            <UiSection.Item
              title="Link strength (single)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...linkStrengthAdapter,
                  }}
                />
              }
            />
            <UiSection.Item
              title="Link strength (multi)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...linkStrengthAdapter,
                    multi: true,
                  }}
                />
              }
            />
          </UiSection>

          <UiSection title="User">
            <UiSection.Item
              title="User (single)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...uAdapter,
                  }}
                />
              }
            />
            <UiSection.Item
              title="User (multi)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...uAdapter,
                    multi: true,
                  }}
                />
              }
            />
            <UiSection.Item
              title="User group (single)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...ugAdapter,
                  }}
                />
              }
            />
            <UiSection.Item
              title="User group (multi)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...ugAdapter,
                    multi: true,
                  }}
                />
              }
            />
          </UiSection>

          <UiSection title="Datalist">
            <UiSection.Item
              title="Datalist (single)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...dlAdapter,
                  }}
                />
              }
            />
            <UiSection.Item
              title="Datalist (multi)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...dlAdapter,
                    multi: true,
                  }}
                />
              }
            />
          </UiSection>

          <UiSection title="Transition">
            <UiSection.Item
              title="Twinflow (single)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...tfAdapter,
                  }}
                />
              }
            />
            <UiSection.Item
              title="Twinflow schema (single)"
              value={
                <AutoField
                  info={{
                    type: AutoFormValueType.combobox,
                    label: "Label",
                    ...tfsAdapter,
                  }}
                />
              }
            />
          </UiSection>

          <UiSection title="Misc">
            <UiSection.Item
              title=""
              value={
                <FeaturerFormField
                  typeId={FeaturerTypes.fieldTyper}
                  control={form.control}
                  name={"fieldTyperFeaturerId"}
                  paramsName="fieldTyperParams"
                  label={"Featurer fieldTyper"}
                />
              }
            />
            <UiSection.Item
              title=""
              value={
                <FeaturerFormField
                  typeId={FeaturerTypes.headHunter}
                  control={form.control}
                  name="fieldTyperFeaturerId"
                  paramsName="fieldTyperParams"
                  label={"Featurer headHunter"}
                />
              }
            />
            <UiSection.Item
              title=""
              value={
                <FeaturerFormField
                  typeId={FeaturerTypes.trigger}
                  control={form.control}
                  name="fieldTyperFeaturerId"
                  paramsName="fieldTyperParams"
                  label={"Featurer trigger"}
                />
              }
            />
            <UiSection.Item
              title=""
              value={
                <FeaturerFormField
                  typeId={FeaturerTypes.validator}
                  control={form.control}
                  name="fieldTyperFeaturerId"
                  paramsName="fieldTyperParams"
                  label={"Featurer validator"}
                />
              }
            />
          </UiSection>
        </div>
      </form>
    </Form>
  );
}
