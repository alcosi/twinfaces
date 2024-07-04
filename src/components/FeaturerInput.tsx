import {Featurer, FeaturerParam} from "@/lib/api/api-types";
import {useContext, useEffect, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {Combobox} from "@/components/ui/combobox";
import {Checkbox} from "@/components/ui/checkbox";
import {FormItem, FormLabel} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

export interface FeaturerValue {
    featurer: Featurer,
    params: { [key: string]: string }
}

export function FeaturerInput({onChange}: { onChange: (value: FeaturerValue | null) => void }) {
    const api = useContext(ApiContext)

    const [selected, setSelected] = useState<Featurer | undefined>(undefined);
    const [params, setParams] = useState<{ [key: string]: string }>({})

    async function fetchHeadHunterFeaturers(search: string): Promise<Featurer[]> {
        const response = await api.featurer.search({
            pagination: {pageIndex: 0, pageSize: 10},
            options: {
                typeIdList: [26],
                // nameLikeList: [search]
            }
        })

        return response.data?.featurerList ?? [];
    }

    function onSelect(newFeaturer?: Featurer) {
        setSelected(newFeaturer);
        setParams({})
    }

    function onParamChange(key: string, value?: string) {
        setParams({...params, [key]: value!})
    }

    useEffect(() => {
        onChange(selected ? {featurer: selected, params} : null)
    }, [selected, params])

    return <>
        <Combobox<Featurer>
            selectPlaceholder={"Select head hunter featurer"}
            searchPlaceholder={"Search head hunter featurer..."}
            noItemsText={"No featurers found"}
            getItems={fetchHeadHunterFeaturers}
            getItemKey={(c) => c.id!.toString()}
            getItemLabel={(c) => {
                let label = c?.id!.toString();
                if (c.name) label += ` (${c.name})`
                return label;
            }}
            onSelect={onSelect}
        />

        {selected?.params?.map(param => {
            return <FeaturerParamInput key={param.key} param={param} onChange={onParamChange}/>
        })}
    </>
}

interface FeaturerParamInputProps {
    param: FeaturerParam,
    onChange: (key: string, value: string) => void
}

function FeaturerParamInput({param, onChange}: FeaturerParamInputProps) {
    const [value, setValue] = useState<string>('');

    useEffect(() => onChange(param.key!, value), [])
    useEffect(() => onChange(param.key!, value), [value])

    function renderInput() {
        switch (param.type) {
            case 'BOOLEAN':
                return <Checkbox checked={value === 'true'}
                                 onCheckedChange={newChecked => setValue(newChecked ? 'true' : 'false')}/>
            default:
                return <div>
                    {/*<p>Unknown type {param.type}</p>*/}
                    <Input value={value} onChange={(e) => setValue(e.target.value)}/>
                </div>
        }

    }

    return <FormItem>
        <FormLabel>{param.name}</FormLabel>
        {renderInput()}
    </FormItem>
}