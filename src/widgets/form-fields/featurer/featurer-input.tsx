import { Featurer } from "@/entities/featurer";
import { ApiContext } from "@/shared/api";
import { isPopulatedArray, isPopulatedString } from "@/shared/libs";
import { Combobox } from "@/shared/ui/combobox";
import { useContext, useEffect, useState } from "react";
import { FeaturerParamInput } from "./featurer-param-input";
import { FeaturerInputProps } from "./types";

export function FeaturerInput({
  typeId,
  defaultId,
  defaultParams,
  onChange,
  buttonClassName,
  selectPlaceholder,
  searchPlaceholder,
  noItemsText,
}: FeaturerInputProps) {
  const api = useContext(ApiContext);

  const [selected, setSelected] = useState<Featurer | undefined>(undefined);
  const [params, setParams] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!selected && defaultId) {
      setById(defaultId, defaultParams);
    }
  }, [defaultId, defaultParams]);

  async function setById(id: number, params?: any) {
    try {
      const response = await api.featurer.search({
        pagination: { pageIndex: 0, pageSize: 10 },
        options: {
          typeIdList: [typeId],
          idList: [id],
        },
      });

      if (response.data?.featurerList?.length != 1) {
        console.error("featurer not found by id", id);
        return;
      }

      const featurer = response.data.featurerList[0];
      setSelected(featurer);
      if (!params) return;
      for (const param of featurer?.params ?? []) {
        const key = param.key;
        if (!key) continue;
        if (params[key]) {
          setParams((old) => {
            return { ...old, [key!]: params[key] };
          });
        }
      }
    } catch (e) {
      console.error("failed to fetch featurer by id", id, e);
      return;
    }
  }

  async function fetchHeadHunterFeaturers(search: string): Promise<Featurer[]> {
    const response = await api.featurer.search({
      pagination: { pageIndex: 0, pageSize: 10 },
      options: {
        typeIdList: [typeId],
        nameLikeList: [search ? "%" + search + "%" : "%"],
      },
    });

    return response.data?.featurerList ?? [];
  }

  function onSelect(newFeaturers?: Featurer[]) {
    setSelected(newFeaturers?.[0]);
    setParams({});
  }

  function onParamChange(key: string, value?: string) {
    setParams((old) => {
      return { ...old, [key]: value! };
    });
  }

  useEffect(() => {
    onChange?.(selected ? { featurer: selected, params } : null);
  }, [selected, params]);

  return (
    <>
      <Combobox<Featurer>
        selectPlaceholder={selectPlaceholder ?? "Select featurer"}
        searchPlaceholder={searchPlaceholder ?? "Search featurer..."}
        noItemsText={noItemsText ?? "No featurers found"}
        getById={async () => undefined}
        getItems={fetchHeadHunterFeaturers}
        renderItem={({ name, id }) =>
          isPopulatedString(name) ? `${name} : ${id}` : id
        }
        initialValues={selected ? [selected] : []}
        onSelect={onSelect}
        buttonClassName={buttonClassName}
      />

      {isPopulatedArray(selected?.params) && (
        <fieldset className="px-1.5 py-2.5 rounded-md border border-dashed">
          <legend className="text-sm font-medium">Param Types</legend>
          <div className="space-y-2">
            {selected.params.map((param) => {
              let value: string = "";
              if (params && param.key) {
                value = params[param.key] ?? "";
              }
              return (
                <FeaturerParamInput
                  key={param.key}
                  param={param}
                  value={value}
                  onChange={onParamChange}
                />
              );
            })}
          </div>
        </fieldset>
      )}
    </>
  );
}
