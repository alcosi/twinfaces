import { components } from "@/shared/api/generated/schema";

export type AuthConfig = components["schemas"]["AuthConfigV1"];
export type AuthMethodDTO = components["schemas"]["AuthMethodDTOv1"];
export type AuthMethodPassword = components["schemas"]["AuthMethodPasswordV1"];
export type AuthLoginRs = components["schemas"]["AuthLoginRsV1"];
export type AuthSignupByEmailRs =
  components["schemas"]["AuthSignupByEmailRsV1"];
export type AuthSignUpVerificationByEmailRs =
  components["schemas"]["AuthSignupByEmailConfirmRsV1"];
export type AuthRefreshRs = components["schemas"]["AuthRefreshRsV1"];
