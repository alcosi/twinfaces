"use client";

import { useRouter } from "next/navigation";
import { ComponentType, ReactNode, useCallback, useContext } from "react";
import { toast } from "sonner";
import { ZodType, z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { TwinResourceLink } from "@/entities/twin";
import { TwinClassField } from "@/entities/twin-class-field";
import { TwinFlowTransition } from "@/entities/twin-flow-transition";
import { TwinClassStatusResourceLink } from "@/entities/twin-status";
import { Twin, TwinUpdateRq, Twin_DETAILED } from "@/entities/twin/server";
import { User, UserResourceLink } from "@/entities/user";
import { PrivateApiContext, RelatedObjects } from "@/shared/api";
import { isPopulatedString } from "@/shared/libs";

import { InPlaceEdit, InPlaceEditProps } from "../../inPlaceEdit";
import { TransitionPerformer } from "../../twin-flow-transition";

type HydratedTwin = Twin & {
  ownerUser?: User;
};

type FieldProps = {
  key: string;
  value: string;
  descriptor: TwinClassField["descriptor"];
  editable?: boolean;
  resourceLinkKey?: string;
};

type Props = {
  id: string;
  twinId: string;
  twin?: Twin;
  label?: ReactNode;
  field: FieldProps;
  schema?: ZodType;
  relatedObjects?: RelatedObjects;
  onSuccess?: () => void;
};

const STATIC_FIELDS = [
  "name",
  "description",
  "externalId",
  "ownerUserId",
  "assignerUserId",
  "authorUserId",
  "headTwinId",
  "statusId",
  "createdAt",
];

const RESOURCE_LINK_MAP: Record<string, ComponentType<any>> = {
  authorUser: UserResourceLink,
  headTwin: TwinResourceLink,
  assignerUser: UserResourceLink,
  ownerUser: UserResourceLink,
  status: TwinClassStatusResourceLink,
};

export function TwinFieldEditor({
  id,
  twinId,
  twin,
  label,
  field,
  schema,
  relatedObjects,
  onSuccess,
}: Props) {
  const api = useContext(PrivateApiContext);
  const router = useRouter();

  const hydratedTwin: HydratedTwin = { ...twin };

  if (hydratedTwin.authorUserId && relatedObjects?.userMap) {
    hydratedTwin.authorUser = relatedObjects.userMap[hydratedTwin.authorUserId];
  }

  if (hydratedTwin.headTwinId && relatedObjects?.twinMap) {
    hydratedTwin.headTwin = relatedObjects.twinMap[hydratedTwin.headTwinId];
  }

  if (hydratedTwin.assignerUserId && relatedObjects?.userMap) {
    hydratedTwin.assignerUser =
      relatedObjects.userMap[hydratedTwin.assignerUserId];
  }

  if (hydratedTwin.ownerUserId && relatedObjects?.userMap) {
    hydratedTwin.ownerUser = relatedObjects.userMap[hydratedTwin.ownerUserId];
  }

  if (hydratedTwin.statusId && relatedObjects?.statusMap) {
    hydratedTwin.status = relatedObjects.statusMap[hydratedTwin.statusId];
  }

  if (hydratedTwin.transitionsIdList && relatedObjects?.transitionsMap) {
    hydratedTwin.transitions = hydratedTwin.transitionsIdList.reduce<
      TwinFlowTransition[]
    >((acc, id) => {
      const transition = relatedObjects?.transitionsMap?.[id];
      if (transition) acc.push(transition);

      return acc;
    }, []);
  }

  const twinFields = hydratedTwin.fields ?? {};
  const hydratedFields: Record<string, string> = { ...twinFields };

  const optionMap = relatedObjects?.dataListsOptionMap ?? {};

  for (const [key, value] of Object.entries(twinFields)) {
    if (typeof value === "object" && value !== null && "name" in value) {
      hydratedFields[key] = (value as { name: string }).name;
    } else if (typeof value === "string" && optionMap[value]) {
      hydratedFields[key] = optionMap[value]?.name!;
    }
  }

  hydratedTwin.fields = hydratedFields;

  const ResourceLinkComponent = field.resourceLinkKey
    ? RESOURCE_LINK_MAP[field.resourceLinkKey]
    : undefined;

  const resourceLinkValue = field.resourceLinkKey
    ? hydratedTwin?.[field.resourceLinkKey as keyof Twin]
    : undefined;

  const renderPreview = () => {
    if (ResourceLinkComponent && resourceLinkValue) {
      return <ResourceLinkComponent data={resourceLinkValue} />;
    }

    const dynamicValue = hydratedTwin?.fields?.[field.key];
    if (dynamicValue) {
      return <span>{dynamicValue}</span>;
    }

    if (typeof dynamicValue === "string" && dynamicValue === "") {
      return <div className="font-light italic text-muted">None</div>;
    }

    return <span>{field.value}</span>;
  };

  const updateTwin = useCallback(
    async (body: TwinUpdateRq) => {
      try {
        await api.twin.update({ id: twinId, body });
        onSuccess?.() || router.refresh();
      } catch (error) {
        console.error("Failed to update twin:", error);
        throw error;
      }
    },
    [api.twin, twinId, router, onSuccess]
  );

  const editProps: InPlaceEditProps<string> = {
    id,
    value: field.value,
    valueInfo: {
      type: AutoFormValueType.twinField,
      label: undefined,
      descriptor: field.descriptor,
      twinId,
    },
    renderPreview,
    schema: schema ?? z.string().min(1),
    onSubmit: async (value) => {
      const body: TwinUpdateRq = STATIC_FIELDS.includes(field.key)
        ? { [field.key]: value }
        : { fields: { [field.key]: value } };

      await updateTwin(body);
    },
  };

  async function handleOnTransitionPerformSuccess() {
    try {
      updateTwin({});
      toast.success("Transition is performed successfully");
    } catch (error) {
      toast.error("Error performing transition");
    }
  }

  return (
    <div className="space-y-0.5">
      {label &&
        (isPopulatedString(label) ? (
          <label className="px-3 text-sm font-bold">{label}</label>
        ) : (
          label
        ))}
      {field.editable ? (
        <InPlaceEdit {...editProps} />
      ) : (
        <div className="px-3 flex gap-2">
          {ResourceLinkComponent && resourceLinkValue ? (
            <ResourceLinkComponent data={resourceLinkValue} />
          ) : (
            field.value
          )}

          {ResourceLinkComponent === TwinClassStatusResourceLink &&
            hydratedTwin &&
            hydratedTwin.transitions && (
              <TransitionPerformer
                twin={hydratedTwin as Twin_DETAILED}
                onSuccess={handleOnTransitionPerformSuccess}
              />
            )}
        </div>
      )}
    </div>
  );
}
