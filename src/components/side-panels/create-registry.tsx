"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { Control } from "react-hook-form";
import { z } from "zod";

import {
  DATALIST_SCHEMA,
  buildDatalistCreateRq,
  useDatalistCreate,
} from "@/entities/datalist";
import {
  DATALIST_OPTION_SCHEMA,
  buildDatalistOptionCreateRq,
  useCreateDatalistOption,
} from "@/entities/datalist-option";
import {
  FACTORY_SCHEMA,
  buildFactoryCreateRq,
  useCreateFactory,
} from "@/entities/factory";
import {
  CONDITION_SET_SCHEMA,
  useFactoryConditionSetCreate,
} from "@/entities/factory-condition-set";
import {
  FACTORY_MULTIPLIER_SCHEMA,
  useFactoryMultiplierCreate,
} from "@/entities/factory-multiplier";
import {
  FACTORY_PIPELINE_SCHEMA,
  useFactoryPipelineCreate,
} from "@/entities/factory-pipeline";
import {
  PERMISSION_SCHEMA,
  buildPermissionCreateRq,
  usePermissionCreate,
} from "@/entities/permission";
import {
  TWIN_CLASSES_SCHEMA,
  buildTwinClassCreateRq,
  useTwinClassCreate,
} from "@/entities/twin-class";
import { useTwinClassFieldCreate } from "@/entities/twin-class-field";
import {
  TWIN_FLOW_SCHEMA,
  buildTwinFlowCreateRq,
  useCreateTwinFlow,
} from "@/entities/twin-flow";
import {
  TWIN_CLASS_STATUS_SCHEMA,
  buildTwinStatusCreateRq,
  useStatusCreate,
} from "@/entities/twin-status";
import {
  TWIN_TRIGGER_SCHEMA,
  useTwinTriggerCreate,
} from "@/entities/twin-trigger";
import {
  VALIDATOR_SETS_SHEMA,
  useValidatorSetCreate,
} from "@/entities/validator-set";
import { LoadingSpinner } from "@/shared/ui";
import { TWIN_CLASS_FIELD_SCHEMA } from "@/widgets/tables/twin-class-fields/constants";
import { buildTwinClassFieldCreateRq } from "@/widgets/tables/twin-class-fields/helpers";

import { CascadeCreateEntity } from "./create-entities";

export interface CascadeCreateDefinition {
  /** Panel heading, e.g. "Create pipeline". */
  title: string;
  schema: z.ZodType<any, any, any>;
  defaultValues: Record<string, unknown>;
  /**
   * Hook returning the submit handler. It has to resolve to the id of what was
   * just created — that is what gets selected back in the combobox.
   */
  useCreate: () => (values: any) => Promise<string | undefined>;
  FormFields: ComponentType<{ control: Control<any> }>;
}

/**
 * Create forms are pulled in on demand: every table screen renders the
 * create/edit sheet, and bundling all of them into each one is a lot of code
 * for a panel most sessions never open.
 */
function lazyFormFields<T extends Record<string, unknown>>(
  load: () => Promise<T>,
  pick: (module: T) => unknown
): ComponentType<{ control: Control<any> }> {
  return dynamic(
    () => load().then((module) => pick(module) as ComponentType<any>),
    { loading: () => <LoadingSpinner className="mt-4" /> }
  );
}

/**
 * The entities a combobox can create on the spot. Every entry reuses the form
 * its own table already uses — same zod schema, same fields, same create call —
 * so an entity only belongs here once creating it is implemented elsewhere.
 */
export const CASCADE_CREATE_DEFINITIONS: Record<
  CascadeCreateEntity,
  CascadeCreateDefinition
> = {
  datalist: {
    title: "Create datalist",
    schema: DATALIST_SCHEMA,
    defaultValues: { key: "", name: "", description: "" },
    useCreate: () => {
      const { createDatalist } = useDatalistCreate();
      return (values) =>
        createDatalist({ body: buildDatalistCreateRq(values) });
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/form-fields/datalist"),
      (m) => m.DatalistFormFields
    ),
  },

  datalistOption: {
    title: "Create datalist option",
    schema: DATALIST_OPTION_SCHEMA,
    defaultValues: {
      dataList: [],
      name: "",
      icon: "",
      attribute1: undefined,
      attribute2: undefined,
      attribute3: undefined,
      attribute4: undefined,
    },
    useCreate: () => {
      const { createDatalistOption } = useCreateDatalistOption();
      return (values) =>
        createDatalistOption({ body: buildDatalistOptionCreateRq(values) });
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/tables/datalist-options/form-fields"),
      (m) => m.DatalistOptionFormFields
    ),
  },

  factory: {
    title: "Create factory",
    schema: FACTORY_SCHEMA,
    defaultValues: { key: "", name: "", description: "" },
    useCreate: () => {
      const { createFactory } = useCreateFactory();
      return (values) => createFactory(buildFactoryCreateRq(values));
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/form-fields/factory"),
      (m) => m.FactoryFormFields
    ),
  },

  factoryConditionSet: {
    title: "Create condition set",
    schema: CONDITION_SET_SCHEMA,
    defaultValues: { name: "", twinFactoryId: "", description: "" },
    useCreate: () => {
      const { createFactoryConditionSet } = useFactoryConditionSetCreate();
      return ({ name, twinFactoryId, description }) =>
        createFactoryConditionSet({
          body: { conditionSets: [{ name, twinFactoryId, description }] },
        });
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/form-fields/condition-set"),
      (m) => m.ConditionSetFields
    ),
  },

  factoryMultiplier: {
    title: "Create multiplier",
    schema: FACTORY_MULTIPLIER_SCHEMA,
    defaultValues: {
      factoryId: "",
      inputTwinClassId: "",
      active: true,
      description: undefined,
    },
    useCreate: () => {
      const { createFactoryMultiplier } = useFactoryMultiplierCreate();
      return ({ factoryId, ...body }) =>
        createFactoryMultiplier({
          id: factoryId,
          body: { factoryMultiplier: body },
        });
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/tables/factory-multipliers/form-fields"),
      (m) => m.FactoryMultiplierFormFields
    ),
  },

  factoryPipeline: {
    title: "Create pipeline",
    schema: FACTORY_PIPELINE_SCHEMA,
    defaultValues: {
      factoryId: "",
      inputTwinClassId: "",
      factoryConditionSetId: "",
      factoryConditionSetInvert: false,
      active: true,
      outputStatusId: "",
      nextFactoryId: "",
      description: undefined,
    },
    useCreate: () => {
      const { createFactoryPipeline } = useFactoryPipelineCreate();
      return ({ factoryId, ...body }) =>
        createFactoryPipeline({
          id: factoryId,
          body: { factoryPipeline: body },
        });
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/tables/factory-pipelines/form-fields"),
      (m) => m.FactoryPipelineFormFields
    ),
  },

  permission: {
    title: "Create permission",
    schema: PERMISSION_SCHEMA,
    defaultValues: { key: "", name: "", description: "", groupId: "" },
    useCreate: () => {
      const { createPermission } = usePermissionCreate();
      return (values) =>
        createPermission({ body: buildPermissionCreateRq(values) });
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/tables/permissions/form-fields"),
      (m) => m.PermissionsFormFields
    ),
  },

  twinClass: {
    title: "Create twin class",
    schema: TWIN_CLASSES_SCHEMA,
    defaultValues: {
      key: "",
      name: "",
      description: "",
      abstractClass: false,
      segment: false,
      assigneeRequired: false,
      headTwinClass: null,
      headHunterFeaturerId: undefined,
      headHunterParams: {},
      extendsTwinClassId: null,
      logo: "",
      permissionSchemaSpace: false,
      twinflowSchemaSpace: false,
      twinClassSchemaSpace: false,
      aliasSpace: false,
      autoCreateTwinflow: false,
      autoCreatePermissions: true,
      space: false,
      uniqueName: false,
    },
    useCreate: () => {
      const { createTwinClass } = useTwinClassCreate();
      return (values) =>
        createTwinClass({ body: buildTwinClassCreateRq(values) });
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/form-fields/twin-class"),
      (m) => m.TwinClassFormFields
    ),
  },

  twinClassField: {
    title: "Create class field",
    schema: TWIN_CLASS_FIELD_SCHEMA,
    defaultValues: {
      twinClassId: "",
      key: "",
      name: "",
      description: "",
      required: false,
      system: false,
      fieldTyperParams: {},
      twinSorterParams: {},
      fieldInitializerParams: {},
      viewPermissionId: "",
      editPermissionId: "",
    },
    useCreate: () => {
      const { createTwinClassField } = useTwinClassFieldCreate();
      return (values) =>
        createTwinClassField({ body: buildTwinClassFieldCreateRq(values) });
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/tables/twin-class-fields/form-fields"),
      (m) => m.TwinClassFieldFormFields
    ),
  },

  twinFlow: {
    title: "Create twinflow",
    schema: TWIN_FLOW_SCHEMA,
    defaultValues: {
      twinClassId: "",
      name: "",
      description: "",
      initialStatus: "",
    },
    useCreate: () => {
      const { createTwinFlow } = useCreateTwinFlow();
      return (values) =>
        createTwinFlow({
          twinClassId: values.twinClassId!,
          body: buildTwinFlowCreateRq(values),
        });
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/tables/twin-flows/form-fields"),
      (m) => m.TwinClassTwinFlowFormFields
    ),
  },

  twinStatus: {
    title: "Create status",
    schema: TWIN_CLASS_STATUS_SCHEMA,
    defaultValues: {
      twinClassId: "",
      key: "",
      name: "",
      description: "",
      backgroundColor: "#000000",
      fontColor: "#000000",
    },
    useCreate: () => {
      const { createStatus } = useStatusCreate();
      return (values) =>
        createStatus({
          twinClassId: values.twinClassId!,
          body: buildTwinStatusCreateRq(values),
        });
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/tables/twin-class-statuses/form-fields"),
      (m) => m.TwinClassStatusFormFields
    ),
  },

  twinTrigger: {
    title: "Create twin trigger",
    schema: TWIN_TRIGGER_SCHEMA,
    defaultValues: {
      triggerParams: {},
      jobTwinClassId: "",
      active: true,
      name: "",
      description: "",
      order: 0,
    },
    useCreate: () => {
      const { createTwinTrigger } = useTwinTriggerCreate();
      return (values) => createTwinTrigger({ body: { triggers: [values] } });
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/tables/twin-triggers/form-fields"),
      (m) => m.TwinTriggerFormFields
    ),
  },

  validatorSet: {
    title: "Create validator set",
    schema: VALIDATOR_SETS_SHEMA,
    defaultValues: { name: "", description: "", invert: false },
    useCreate: () => {
      const { createValidatorSet } = useValidatorSetCreate();
      return (values) =>
        createValidatorSet({ body: { validatorSets: [values] } });
    },
    FormFields: lazyFormFields(
      () => import("@/widgets/tables/validator-sets/form-fields"),
      (m) => m.ValidatorSetFormFields
    ),
  },
};
