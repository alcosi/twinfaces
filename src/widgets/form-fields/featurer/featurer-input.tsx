import {
  Featurer,
  FeaturerParams,
  FeaturerParamType,
  FeaturerParamValue,
  FeaturerValue,
} from "@/entities/featurer";
import { ApiContext } from "@/shared/api";
import {
  isPopulatedArray,
  isPopulatedString,
  PartialFields,
} from "@/shared/libs";
import { Combobox } from "@/shared/ui/combobox";
import { useContext, useState } from "react";
import { FeaturerParamInput } from "./featurer-param-input";
import { FeaturerInputProps } from "./types";

type State = PartialFields<FeaturerValue, "featurer">;

export function FeaturerInput({
  typeId,
  onChange,
  selectPlaceholder = "Select featurer",
  searchPlaceholder = "Search featurer...",
  noItemsText = "No featurers found",
}: FeaturerInputProps) {
  const api = useContext(ApiContext);

  const [state, setState] = useState<State>({
    featurer: undefined,
    params: {},
  });

  const fetchFeaturers = async (search: string): Promise<Featurer[]> => {
    try {
      const response = await api.featurer.search({
        pagination: { pageIndex: 0, pageSize: 10 },
        options: {
          typeIdList: [typeId],
          nameLikeList: [search ? `%${search}%` : "%"],
        },
      });
      return response.data?.featurerList ?? [];
    } catch (error) {
      console.error("Error fetching featurers:", error);
      return [];
    }
  };

  const handleFeaturerSelect = (newFeaturers?: Featurer[]) => {
    const selectedFeaturer: State["featurer"] = newFeaturers?.[0];
    const initialParams: State["params"] =
      selectedFeaturer?.params?.reduce((acc, param) => {
        if (param.key) {
          acc[param.key] = {
            value: "",
            type: param.type as FeaturerParamType,
          };
        }
        return acc;
      }, {} as FeaturerParams) ?? {};

    const next: State = {
      featurer: selectedFeaturer,
      params: initialParams,
    };

    if (next.featurer) {
      onChange?.(next as FeaturerValue);
    }

    setState(next);
  };

  const handleParamChange = (key: string, newValue?: FeaturerParamValue) => {
    setState((prev) => {
      const nextParams: FeaturerParams = {
        ...prev.params,
        [key]: {
          value: newValue ?? "",
          type: prev.params?.[key]?.type!,
        },
      };

      const next: State = {
        featurer: prev.featurer,
        params: nextParams,
      };

      if (next.featurer) {
        onChange?.(next as FeaturerValue);
      }

      return next;
    });
  };

  return (
    <>
      <Combobox<Featurer>
        selectPlaceholder={selectPlaceholder}
        searchPlaceholder={searchPlaceholder}
        noItemsText={noItemsText}
        getById={async () => undefined}
        getItems={fetchFeaturers}
        renderItem={({ name, id }) =>
          isPopulatedString(name) ? `${name} : ${id}` : `${id}`
        }
        initialValues={state.featurer ? [state.featurer] : []}
        onSelect={handleFeaturerSelect}
        buttonClassName="w-full"
      />

      {isPopulatedArray(state.featurer?.params) && (
        <fieldset className="px-1.5 py-2.5 rounded-md border border-dashed">
          <legend className="text-sm font-medium italic">Params</legend>
          <div className="space-y-2">
            {state.featurer.params.map((param) => (
              <FeaturerParamInput
                key={param.key}
                param={param}
                value={state.params?.[param.key!]?.value ?? ""}
                onChange={handleParamChange}
              />
            ))}
          </div>
        </fieldset>
      )}
    </>
  );
}
