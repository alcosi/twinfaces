export const ENTITY_COLOR = "#0EA5E9";

export const FeaturerTypes = {
  fieldTyper: 13,
  trigger: 15,
  validator: 16,
  headHunter: 26,
} as const;

export type FeaturerTypeId = (typeof FeaturerTypes)[keyof typeof FeaturerTypes];
