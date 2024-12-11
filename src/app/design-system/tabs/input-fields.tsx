import { AutoField, AutoFormValueType } from "@/components/auto-field";
import { useTwinClassSelectAdapter } from "@/entities/twinClass";
import { useUserSelectAdapter } from "@/entities/user/libs";
import { Form } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UiSection } from "../components/ui-section";
import { useUserGroupSelectAdapter } from "@/entities/userGroup/libs/hooks";

export function InputFieldsTab() {
  const tcAdapter = useTwinClassSelectAdapter();
  const uAdapter = useUserSelectAdapter();
  const ugAdapter = useUserGroupSelectAdapter();

  const form = useForm({
    resolver: zodResolver(z.any()),
    defaultValues: {},
  });

  return (
    <Form {...form}>
      <form className="h-screen">
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
        </div>
      </form>
    </Form>
  );
}
