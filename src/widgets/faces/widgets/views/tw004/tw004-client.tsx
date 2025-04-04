"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";

import { AutoFormValueType } from "@/components/auto-field";

import { TwinUpdateRq } from "@/entities/twin/server";
import { InPlaceEdit, InPlaceEditProps } from "@/features/inPlaceEdit";
import { PrivateApiContext } from "@/shared/api";

type Props = {
  id: string;
  twinId: string;
  label?: string;
  fieldKey: string;
  fieldValue: string;
};

// TODO: Not a final solution — needs improvement and cleanup.
export function TW004Client(props: Props) {
  const api = useContext(PrivateApiContext);
  const router = useRouter();

  async function updateTwin(body: TwinUpdateRq) {
    try {
      await api.twin.update({ id: props.twinId, body });
      router.refresh();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  const settings: InPlaceEditProps<string> = {
    id: props.id,
    value: props.fieldValue,
    valueInfo: {
      type: AutoFormValueType.string,
      label: props.label,
      inputProps: {
        fieldSize: "sm",
      },
    },
    renderPreview: (value) => {
      return (
        <div className="space-x-2">
          <b>{props.label}:</b>
          <span className="italic">{props.fieldValue}</span>
        </div>
      );
    },
    onSubmit: (value) => {
      return updateTwin({
        fields: {
          [props.fieldKey]: value,
        },
      });
    },
  };

  return <InPlaceEdit {...settings} />;
}
