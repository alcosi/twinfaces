/**
 * Entities a combobox can offer to create on the spot, when the option the
 * user is after isn't in the list yet. Only entities whose create form already
 * exists in the project belong here — see `CASCADE_CREATE_DEFINITIONS`.
 *
 * Kept import-free on purpose: `auto-field` references these types, and pulling
 * the registry (and with it every create form) in from there would be a cycle.
 */
export type CascadeCreateEntity =
  | "datalist"
  | "datalistOption"
  | "factory"
  | "factoryConditionSet"
  | "factoryMultiplier"
  | "factoryPipeline"
  | "permission"
  | "twinClass"
  | "twinClassField"
  | "twinFlow"
  | "twinStatus"
  | "twinTrigger"
  | "validatorSet";

export type CascadeCreateConfig = {
  entity: CascadeCreateEntity;
  /**
   * Seeds the nested create form — e.g. a pipeline created from a step's
   * "Pipeline" field can start out inside the step's own factory.
   */
  defaultValues?: Record<string, unknown>;
};
