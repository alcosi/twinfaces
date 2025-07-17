import {
  FaceTC001,
  FaceTC001ViewRs,
  FaceTC002,
  FaceTC002ViewRs,
} from "@/entities/face";
import { TwinClassField } from "@/entities/twin-class-field";

export type TCSchemaMap = {
  TC001: FaceTC001;
  TC002: FaceTC002;
};

export type TCViewMap = {
  TC001: FaceTC001ViewRs;
  TC002: FaceTC002ViewRs;
};

export type TCFormField = {
  key: string;
  label: string;
  twinClassFieldId: string;
  twinClassField?: TwinClassField;
};
