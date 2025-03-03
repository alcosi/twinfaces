import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AutoField, AutoFormValueType } from "@/components/auto-field";

import { useDatalistSelectAdapter } from "@/entities/datalist";
import { FeaturerTypes } from "@/entities/featurer";
import {
  useLinkStrengthSelectAdapter,
  useLinkTypeSelectAdapter,
} from "@/entities/link";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useTwinFlowSelectAdapter } from "@/entities/twin-flow";
import { TwinFieldType } from "@/entities/twinField";
import { useTwinFlowSchemaSelectAdapter } from "@/entities/twinFlowSchema";
import { useUserSelectAdapter } from "@/entities/user";
import { useUserGroupSelectAdapter } from "@/entities/user-group";
import { Button, Form } from "@/shared/ui";
import { FeaturerFormField, TwinFieldFormField } from "@/widgets/form-fields";

import { UiSection } from "../components/ui-section";
import { Fake } from "../seeds";

const FORM_SCHEMA = z.any();
type FormValues = z.infer<typeof FORM_SCHEMA>;

const TWIN_FIELDS_FORM_SCHEMA = z.object({
  textV1: z.string(),
  urlV1: z.string().url(),
  immutableV1: z.string(),
  numericV1: z.number(),
  numericFieldV1: z.number(),
  // Select
  selectLinkV1: z.any(),
  selectLinkLongV1: z.any(),
  //
  selectListV1: z.any(),
  selectListLongV1: z.any(),
  selectLongV1: z.any(),
});
type TwinFieldsFormValues = z.infer<typeof TWIN_FIELDS_FORM_SCHEMA>;

export function InputFieldsTab() {
  const tcAdapter = useTwinClassSelectAdapter();
  const uAdapter = useUserSelectAdapter();
  const ugAdapter = useUserGroupSelectAdapter();
  const linkTypeAdapter = useLinkTypeSelectAdapter();
  const linkStrengthAdapter = useLinkStrengthSelectAdapter();
  const dlAdapter = useDatalistSelectAdapter();
  const tfAdapter = useTwinFlowSelectAdapter();
  const tfsAdapter = useTwinFlowSchemaSelectAdapter();

  const form = useForm<FormValues>({
    defaultValues: {},
    resolver: zodResolver(FORM_SCHEMA),
  });

  const twinFieldsForm = useForm<TwinFieldsFormValues>({
    defaultValues: {
      textV1: Fake.FieldInputs.textV1.value,
      urlV1: Fake.FieldInputs.urlV1.value,
      immutableV1: Fake.FieldInputs.immutableV1.value,
      numericV1: Fake.FieldInputs.numericV1.value,
      numericFieldV1: Fake.FieldInputs.numericFieldV1.value,
    },
    resolver: zodResolver(TWIN_FIELDS_FORM_SCHEMA),
  });

  async function internalSubmit(newValue: FormValues) {
    console.log("foobar onSubmit", newValue, {
      // isValid: form.formState.isValid,
      // errors: form.formState.errors,
    });
  }

  const mockTwinClassId = "e2b4b9c0-4cdd-42a0-a52a-a8e439b1c17b";

  return (
    <>
      <Form {...twinFieldsForm}>
        <form
          className="h-screen overflow-y-auto max-h-98"
          style={{
            maxHeight: "calc(100vh - var(--header-height))",
          }}
          onSubmit={twinFieldsForm.handleSubmit(internalSubmit)}
        >
          <div className="space-y-4 p-4">
            <Button type="submit">Submit</Button>
            <UiSection title="Twin Fields">
              <UiSection.Item
                title="Text fields"
                value={
                  <div className="my-4 space-y-4">
                    <TwinFieldFormField
                      control={twinFieldsForm.control}
                      descriptor={Fake.FieldInputs.textV1.descriptor}
                      name={TwinFieldType.textV1}
                      label={TwinFieldType.textV1}
                      twinClassId={mockTwinClassId}
                    />

                    <TwinFieldFormField
                      control={twinFieldsForm.control}
                      descriptor={Fake.FieldInputs.urlV1.descriptor}
                      name={TwinFieldType.urlV1}
                      label={TwinFieldType.urlV1}
                      twinClassId={mockTwinClassId}
                    />

                    <TwinFieldFormField
                      control={twinFieldsForm.control}
                      descriptor={Fake.FieldInputs.immutableV1.descriptor}
                      name={TwinFieldType.immutableV1}
                      label={TwinFieldType.immutableV1}
                      twinClassId={mockTwinClassId}
                    />
                  </div>
                }
              />

              <UiSection.Item
                title="Number fields"
                value={
                  <div className="my-4 space-y-4">
                    <TwinFieldFormField
                      control={twinFieldsForm.control}
                      descriptor={Fake.FieldInputs.numericV1.descriptor}
                      name={TwinFieldType.numericV1}
                      label={TwinFieldType.numericV1}
                      twinClassId={mockTwinClassId}
                    />

                    <TwinFieldFormField
                      control={twinFieldsForm.control}
                      descriptor={Fake.FieldInputs.numericFieldV1.descriptor}
                      name={TwinFieldType.numericFieldV1}
                      label={TwinFieldType.numericFieldV1}
                      twinClassId={mockTwinClassId}
                    />
                  </div>
                }
              />

              <UiSection.Item
                title="Select fields"
                value={
                  <div className="my-4 space-y-4">
                    <TwinFieldFormField
                      control={twinFieldsForm.control}
                      descriptor={Fake.FieldInputs.selectLinkV1.descriptor}
                      name={TwinFieldType.selectLinkV1}
                      label={TwinFieldType.selectLinkV1}
                      twinClassId={mockTwinClassId}
                    />
                    <TwinFieldFormField
                      control={form.control}
                      descriptor={Fake.FieldInputs.selectLinkLongV1.descriptor}
                      name={TwinFieldType.selectLinkLongV1}
                      label={TwinFieldType.selectLinkLongV1}
                      twinClassId={mockTwinClassId}
                    />
                    <TwinFieldFormField
                      control={form.control}
                      descriptor={Fake.FieldInputs.selectListV1.descriptor}
                      name={TwinFieldType.selectListV1}
                      label={TwinFieldType.selectListV1}
                      twinClassId={mockTwinClassId}
                    />
                    <TwinFieldFormField
                      control={form.control}
                      descriptor={Fake.FieldInputs.selectListLongV1.descriptor}
                      name={TwinFieldType.selectListLongV1}
                      label={TwinFieldType.selectListLongV1}
                      twinClassId={mockTwinClassId}
                    />
                    <TwinFieldFormField
                      control={form.control}
                      descriptor={Fake.FieldInputs.selectLongV1.descriptor}
                      name={TwinFieldType.selectLongV1}
                      label={TwinFieldType.selectLongV1}
                      twinClassId={mockTwinClassId}
                    />
                    <TwinFieldFormField
                      control={form.control}
                      descriptor={
                        Fake.FieldInputs.selectSharedInHeadV1.descriptor
                      }
                      name={TwinFieldType.selectSharedInHeadV1}
                      label={TwinFieldType.selectSharedInHeadV1}
                      twinClassId={mockTwinClassId}
                    />
                    <TwinFieldFormField
                      control={form.control}
                      descriptor={Fake.FieldInputs.selectUserV1.descriptor}
                      name={TwinFieldType.selectUserV1}
                      label={TwinFieldType.selectUserV1}
                      twinClassId={mockTwinClassId}
                    />

                    <TwinFieldFormField
                      control={form.control}
                      descriptor={Fake.FieldInputs.selectUserLongV1.descriptor}
                      name={TwinFieldType.selectUserLongV1}
                      label={TwinFieldType.selectUserLongV1}
                      twinClassId={mockTwinClassId}
                    />
                  </div>
                }
              />

              <UiSection.Item
                title="File fields"
                value={
                  <div className="my-4 space-y-4">
                    <TwinFieldFormField
                      control={form.control}
                      descriptor={Fake.FieldInputs.attachmentFieldV1.descriptor}
                      name={TwinFieldType.attachmentFieldV1}
                      label={TwinFieldType.attachmentFieldV1}
                      twinClassId={mockTwinClassId}
                    />
                    <TwinFieldFormField
                      control={form.control}
                      descriptor={Fake.FieldInputs.attachmentV1.descriptor}
                      name={TwinFieldType.attachmentFieldV1}
                      label={TwinFieldType.attachmentFieldV1}
                      twinClassId={mockTwinClassId}
                    />
                  </div>
                }
              />

              <UiSection.Item
                title="Misc"
                value={
                  <div className="my-4 space-y-4">
                    <TwinFieldFormField
                      control={form.control}
                      descriptor={Fake.FieldInputs.colorHexV1.descriptor}
                      name={TwinFieldType.colorHexV1}
                      label={TwinFieldType.colorHexV1}
                      twinClassId={mockTwinClassId}
                    />

                    <TwinFieldFormField
                      control={form.control}
                      descriptor={Fake.FieldInputs.dateScrollV1.descriptor}
                      name={TwinFieldType.dateScrollV1}
                      label="dabeScrollV1"
                      twinClassId={mockTwinClassId}
                    />

                    <TwinFieldFormField
                      control={form.control}
                      descriptor={{ fieldType: "random" }}
                      name=""
                      label="not supported type"
                      twinClassId={mockTwinClassId}
                    />
                  </div>
                }
              />
            </UiSection>
          </div>
        </form>
      </Form>

      <Form {...form}>
        <form
          className="h-screen overflow-y-auto max-h-98"
          style={{
            maxHeight: "calc(100vh - var(--header-height))",
          }}
          onSubmit={form.handleSubmit(internalSubmit)}
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
                    label="Featurer fieldTyper"
                    control={form.control}
                    name="fieldTyperFeaturerId"
                    paramsFieldName="fieldTyperParams"
                  />
                }
              />

              <UiSection.Item
                title=""
                value={
                  <FeaturerFormField
                    typeId={FeaturerTypes.headHunter}
                    control={form.control}
                    label={"Featurer headHunter"}
                    name="headHunterFeaturerId"
                    paramsFieldName="headHunterFeaturerParams"
                  />
                }
              />
              <UiSection.Item
                title=""
                value={
                  <FeaturerFormField
                    typeId={FeaturerTypes.trigger}
                    control={form.control}
                    label={"Featurer trigger"}
                    name="triggerFeaturerId"
                    paramsFieldName="triggerFeaturerParams"
                  />
                }
              />
              <UiSection.Item
                title=""
                value={
                  <FeaturerFormField
                    typeId={FeaturerTypes.validator}
                    control={form.control}
                    label={"Featurer validator"}
                    name="validatorFeaturerId"
                    paramsFieldName="validatorFeaturerParams"
                  />
                }
              />
            </UiSection>

            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
