import { Checkbox } from "@/components/base/checkbox";
import { Combobox } from "@/components/base/combobox";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/base/form";
import { Input } from "@/components/base/input";
import { ApiContext } from "@/lib/api/api";
import { Featurer, FeaturerParam } from "@/lib/api/api-types";
import { useContext, useEffect, useState } from "react";

export const FeaturerTypes = {
  fieldTyper: 13,
  trigger: 15,
  validator: 16,
  headHunter: 26,
};

export interface FeaturerValue {
  featurer: Featurer;
  params: { [key: string]: string };
}

export interface FeaturerInputProps {
  typeId: number;
  defaultId?: number;
  defaultParams?: object;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: FeaturerValue | null) => any;
  buttonClassName?: string;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  noItemsText?: string;
}

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
    console.log("FeaturerInputInternal on mount", defaultId);

    return () => {
      console.log("FeaturerInputInternal on unmount");
    };
  }, []);

  useEffect(() => {
    console.log(
      "FeaturerInputInternal on defaultId change",
      selected,
      defaultId
    );
    if (!selected && defaultId) {
      setById(defaultId, defaultParams);
    }
  }, [defaultId, defaultParams]);

  async function setById(id: number, params?: any) {
    console.log("setById", id, params);
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

  function onSelect(newFeaturer?: Featurer) {
    console.log("onSelect", newFeaturer);
    setSelected(newFeaturer);
    setParams({});
  }

  function onParamChange(key: string, value?: string) {
    console.log("onParamChange", key, value);
    setParams((old) => {
      return { ...old, [key]: value! };
    });
  }

  useEffect(() => {
    onChange?.(selected ? { featurer: selected, params } : null);
    console.log("onChange", selected, params);
  }, [selected, params]);

  return (
    <>
      <Combobox<Featurer>
        selectPlaceholder={selectPlaceholder ?? "Select featurer"}
        searchPlaceholder={searchPlaceholder ?? "Search featurer..."}
        noItemsText={noItemsText ?? "No featurers found"}
        getItems={fetchHeadHunterFeaturers}
        getItemKey={(c) => c.id!.toString()}
        getItemLabel={(c) => {
          let label = c?.id!.toString();
          if (c.name) label += ` (${c.name})`;
          return label;
        }}
        value={selected}
        onSelect={onSelect}
        buttonClassName={buttonClassName}
      />

      {selected?.params?.map((param) => {
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
    </>
  );
}

interface FeaturerParamInputProps {
  param: FeaturerParam;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (key: string, value: string) => void;
}

const ParamTypes = {
  boolean: "BOOLEAN",
  string: "STRING",
};

function FeaturerParamInput({
  param,
  value,
  onChange,
}: FeaturerParamInputProps) {
  // const [value, setValue] = useState<string>('');

  useEffect(() => {
    // TODO remove hardcoded decimalSeparator default value when there are default values in the API
    if (param.key === "decimalSeparator") {
      // setValue('.')
      onChange(param.key!, ".");
      return;
    }

    onChange(param.key!, value);
  }, []);

  useEffect(() => {
    onChange(param.key!, value);
  }, [value]);

  function setValue(newValue: string) {
    onChange(param.key!, newValue);
  }

  if (param.type === ParamTypes.boolean) {
    return (
      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
        <FormControl>
          <Checkbox
            checked={value === "true"}
            className={"ml-3"}
            onCheckedChange={(newChecked) =>
              setValue(newChecked ? "true" : "false")
            }
          />
        </FormControl>
        <div className="space-y-1 leading-none">
          {param.name && <FormLabel>{param.name}</FormLabel>}
          {param.description && (
            <FormDescription>{param.description}</FormDescription>
          )}
        </div>
      </FormItem>
    );
  }

  function renderInput() {
    switch (param.type) {
      // TODO Support other parameter types
      case ParamTypes.string:
      default:
        return (
          <div>
            {/*<p>Unknown type {param.type}</p>*/}
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
        );
    }
  }

  return (
    <FormItem>
      <FormLabel>{param.name}</FormLabel>
      {renderInput()}
      {param.description && (
        <FormDescription>{param.description}</FormDescription>
      )}
    </FormItem>
  );
}
