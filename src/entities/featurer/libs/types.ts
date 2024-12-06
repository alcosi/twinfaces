import { Featurer } from "../api";

export interface FeaturerValue {
  featurer: Featurer;
  params: { [key: string]: string };
}
