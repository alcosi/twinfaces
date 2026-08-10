"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  FACTORY_BRANCH_SCHEMA,
  useFactoryBranchCreate,
} from "@/entities/factory-branch";
import {
  FACTORY_CONDITION_SCHEMA,
  useFactoryConditionCreate,
} from "@/entities/factory-condition";
import {
  CONDITION_SET_SCHEMA,
  ConditionSetFieldValues,
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
  PIPELINE_STEP_SCHEMA,
  usePipelineStepCreate,
} from "@/entities/factory-pipeline-step";
import {
  CrudDataTableDialog,
  CrudDataTableDialogRef,
} from "@/widgets/crud-data-table";
import { ConditionSetFields } from "@/widgets/form-fields";
import {
  FactoryBranchFormFields,
  FactoryConditionFormFields,
  FactoryMultiplierFormFields,
  FactoryPipelineFormFields,
  PipelineStepFormFields,
} from "@/widgets/tables";

import { FactoryCreateTarget } from "../model";

export type FactoryCreateSheetsRef = {
  open: (target: FactoryCreateTarget) => void;
};

/**
 * The create side sheets the graph's dashed placeholders open. Each one reuses
 * the very form the corresponding table uses — same zod schema, same fields,
 * same create hook — only pre-scoped to the entity the placeholder hangs off.
 *
 * Erasers and multiplier filters are the only ones left out: neither has a
 * create hook nor form fields anywhere in the project, so their placeholders say
 * so instead of opening an empty sheet.
 */
export const FactoryCreateSheets = forwardRef(Component);

function Component(
  { onCreated }: { onCreated: () => void },
  ref: ForwardedRef<FactoryCreateSheetsRef>
) {
  const pipelineDialogRef = useRef<CrudDataTableDialogRef>(null);
  const branchDialogRef = useRef<CrudDataTableDialogRef>(null);
  const multiplierDialogRef = useRef<CrudDataTableDialogRef>(null);
  const stepDialogRef = useRef<CrudDataTableDialogRef>(null);
  const conditionSetDialogRef = useRef<CrudDataTableDialogRef>(null);
  const conditionDialogRef = useRef<CrudDataTableDialogRef>(null);

  const { createFactoryPipeline } = useFactoryPipelineCreate();
  const { createFactoryBranch } = useFactoryBranchCreate();
  const { createFactoryMultiplier } = useFactoryMultiplierCreate();
  const { createPipelineStep } = usePipelineStepCreate();
  const { createFactoryConditionSet } = useFactoryConditionSetCreate();
  const { createFactoryCondition } = useFactoryConditionCreate();

  const pipelineForm = useForm<z.infer<typeof FACTORY_PIPELINE_SCHEMA>>({
    resolver: zodResolver(FACTORY_PIPELINE_SCHEMA),
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
  });

  const branchForm = useForm<z.infer<typeof FACTORY_BRANCH_SCHEMA>>({
    resolver: zodResolver(FACTORY_BRANCH_SCHEMA),
    defaultValues: {
      factoryId: "",
      factoryConditionSetId: "",
      factoryConditionSetInvert: false,
      active: true,
      nextFactoryId: "",
      description: undefined,
    },
  });

  const multiplierForm = useForm<z.infer<typeof FACTORY_MULTIPLIER_SCHEMA>>({
    resolver: zodResolver(FACTORY_MULTIPLIER_SCHEMA),
    defaultValues: {
      factoryId: "",
      inputTwinClassId: "",
      active: true,
      description: undefined,
    },
  });

  const stepForm = useForm<z.infer<typeof PIPELINE_STEP_SCHEMA>>({
    resolver: zodResolver(PIPELINE_STEP_SCHEMA),
    defaultValues: {
      factoryPipelineId: "",
      factoryConditionSetId: "",
      factoryConditionSetInvert: false,
      active: true,
      optional: false,
      order: 0,
      description: undefined,
    },
  });

  const conditionSetForm = useForm<ConditionSetFieldValues>({
    resolver: zodResolver(CONDITION_SET_SCHEMA),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const conditionForm = useForm<z.infer<typeof FACTORY_CONDITION_SCHEMA>>({
    resolver: zodResolver(FACTORY_CONDITION_SCHEMA),
    defaultValues: {
      factoryConditionSetId: "",
      active: true,
      invert: false,
      description: undefined,
    },
  });

  const [scopedConditionSetId, setScopedConditionSetId] = useState<
    string | undefined
  >(undefined);

  useImperativeHandle(ref, () => ({
    open: (target) => {
      switch (target.entity) {
        case "pipeline":
          // `open(row)` seeds the form; without an `id` the sheet stays in
          // create mode, which is what a placeholder always wants.
          return pipelineDialogRef.current?.open({
            ...pipelineForm.formState.defaultValues,
            factoryId: target.factoryId,
          });

        case "branch":
          return branchDialogRef.current?.open({
            ...branchForm.formState.defaultValues,
            factoryId: target.factoryId,
          });

        case "multiplier":
          return multiplierDialogRef.current?.open({
            ...multiplierForm.formState.defaultValues,
            factoryId: target.factoryId,
          });

        case "pipelineStep":
          return stepDialogRef.current?.open({
            ...stepForm.formState.defaultValues,
            factoryPipelineId: target.pipelineId,
            order: target.order ?? 0,
          });

        case "conditionSet":
          return conditionSetDialogRef.current?.open({
            ...conditionSetForm.formState.defaultValues,
            twinFactoryId: target.factoryId,
          });

        case "condition":
          // Kept in state as well as in the form so the fields can lock the
          // condition-set picker outright, the way the conditions table does.
          setScopedConditionSetId(target.conditionSetId);
          return conditionDialogRef.current?.open({
            ...conditionForm.formState.defaultValues,
            factoryConditionSetId: target.conditionSetId,
          });

        case "nextFactory":
          return toast.info(
            "Set the next factory by editing the pipeline or branch."
          );

        default:
          return toast.info(
            `Creating a ${labelOf(target)} is not supported yet.`
          );
      }
    },
  }));

  return (
    <>
      <CrudDataTableDialog
        ref={pipelineDialogRef}
        title="Create pipeline"
        dialogForm={pipelineForm}
        renderFormFields={() => (
          <FactoryPipelineFormFields control={pipelineForm.control} />
        )}
        onCreateSubmit={async (values) => {
          const { factoryId, ...body } = values as z.infer<
            typeof FACTORY_PIPELINE_SCHEMA
          >;
          await createFactoryPipeline({
            id: factoryId,
            body: { factoryPipeline: body },
          });
          toast.success("Factory pipeline created successfully!");
        }}
        onSubmitSuccess={onCreated}
      />

      <CrudDataTableDialog
        ref={branchDialogRef}
        title="Create branch"
        dialogForm={branchForm}
        renderFormFields={() => (
          <FactoryBranchFormFields control={branchForm.control} />
        )}
        onCreateSubmit={async (values) => {
          const { factoryId, ...body } = values as z.infer<
            typeof FACTORY_BRANCH_SCHEMA
          >;
          await createFactoryBranch({ id: factoryId, body });
          toast.success("Factory branch created successfully!");
        }}
        onSubmitSuccess={onCreated}
      />

      <CrudDataTableDialog
        ref={multiplierDialogRef}
        title="Create multiplier"
        dialogForm={multiplierForm}
        renderFormFields={() => (
          <FactoryMultiplierFormFields control={multiplierForm.control} />
        )}
        onCreateSubmit={async (values) => {
          const { factoryId, ...body } = values as z.infer<
            typeof FACTORY_MULTIPLIER_SCHEMA
          >;
          await createFactoryMultiplier({
            id: factoryId,
            body: { factoryMultiplier: body },
          });
          toast.success("Factory multiplier created successfully!");
        }}
        onSubmitSuccess={onCreated}
      />

      <CrudDataTableDialog
        ref={stepDialogRef}
        title="Create pipeline step"
        dialogForm={stepForm}
        renderFormFields={() => (
          <PipelineStepFormFields control={stepForm.control} />
        )}
        onCreateSubmit={async (values) => {
          const { factoryPipelineId, ...body } = values as z.infer<
            typeof PIPELINE_STEP_SCHEMA
          >;
          await createPipelineStep({
            id: factoryPipelineId,
            body: { factoryPipelineStep: body },
          });
          toast.success("Pipeline step created successfully!");
        }}
        onSubmitSuccess={onCreated}
      />

      <CrudDataTableDialog
        ref={conditionSetDialogRef}
        title="Create condition set"
        dialogForm={conditionSetForm}
        renderFormFields={() => (
          <ConditionSetFields control={conditionSetForm.control} />
        )}
        onCreateSubmit={async (values) => {
          const { name, twinFactoryId, description } =
            values as ConditionSetFieldValues;
          await createFactoryConditionSet({
            body: { conditionSets: [{ name, twinFactoryId, description }] },
          });
          toast.success("Condition set created successfully!");
        }}
        onSubmitSuccess={onCreated}
      />

      <CrudDataTableDialog
        ref={conditionDialogRef}
        title="Create condition"
        dialogForm={conditionForm}
        renderFormFields={() => (
          <FactoryConditionFormFields
            control={conditionForm.control}
            factoryConditionSetId={scopedConditionSetId}
          />
        )}
        onCreateSubmit={async (values) => {
          await createFactoryCondition({
            body: {
              conditions: [values as z.infer<typeof FACTORY_CONDITION_SCHEMA>],
            },
          });
          toast.success("Factory condition created successfully!");
        }}
        onSubmitSuccess={onCreated}
      />
    </>
  );
}

function labelOf(target: FactoryCreateTarget): string {
  switch (target.entity) {
    case "eraser":
      return "factory eraser";
    case "multiplierFilter":
      return "multiplier filter";
    case "trigger":
      return "factory trigger";
    default:
      return target.entity;
  }
}
