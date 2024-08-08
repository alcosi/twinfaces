import {TwinClass, TwinClassUpdateRq} from "@/lib/api/api-types";
import {Table, TableBody, TableCell, TableRow} from "@/components/base/table";
import {AutoEditDialogSettings, AutoDialog} from "@/components/AutoDialog";
import {useContext, useState} from "react";
import {AutoFormValueInfo, AutoFormValueType} from "@/components/AutoField";
import {ApiContext} from "@/lib/api/api";
import {z} from "zod";
import {FeaturerTypes} from "@/components/FeaturerInput";

export function TwinClassGeneral({twinClass, onChange}: { twinClass: TwinClass, onChange?: () => any }) {
    const api = useContext(ApiContext);

    const [editFieldDialogOpen, setEditFieldDialogOpen] = useState(false);
    const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] = useState<AutoEditDialogSettings | undefined>(undefined);

    async function updateTwinClass(newClass: TwinClassUpdateRq) {
        try {
            await api.twinClass.update({id: twinClass.id!, body: newClass});
            console.log('updated');
            onChange?.();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async function fetchClasses(search: string) {
        const {data, error} = await api.twinClass.search({pagination: {pageIndex: 0, pageSize: 10}, search});

        if (error) {
            console.error('failed to fetch classes', error)
            throw new Error("Failed to fetch classes")
        }

        return data.twinClassList ?? []
    }

    async function findClassById(id: string) {
        const response = await api.twinClass.getById({
            id, query: {
                showTwinClassMode: 'DETAILED',
                showTwin2TwinClassMode: 'SHORT'
            }
        })
        return response.data?.twinClass;
    }

    const classValues: { [key: string]: AutoEditDialogSettings } = {
        // key: {
        //     name: "Key",
        //     value: {"key": twinClass.key},
        //     title: 'Update key',
        //     onSubmit: (values) => {
        //         return updateTwinClass({key: values.key})
        //     },
        //     valuesInfo: {
        //         "key": {
        //             type: AutoFormValueType.uuid
        //         }
        //     }
        // },
        name: {
            value: {"name": twinClass.name},
            title: 'Update name',
            schema: z.object({name: z.string().min(3)}),
            onSubmit: (values) => {
                return updateTwinClass({nameI18n: {translationInCurrentLocale: values.name}})
            },
            valuesInfo: {
                "name": {
                    type: AutoFormValueType.string, label: "Name"
                }
            }
        },
        description: {
            value: {"description": twinClass.description},
            title: 'Update description',
            onSubmit: (values) => {
                return updateTwinClass({descriptionI18n: {translationInCurrentLocale: values.description}})
            },
            valuesInfo: {
                "description": {
                    type: AutoFormValueType.string,
                    label: "Description"
                }
            }
        },
        abstractClass: {
            value: {"abstractClass": twinClass.abstractClass},
            title: 'Update abstract',
            onSubmit: (values) => {
                return updateTwinClass({abstractClass: values.abstractClass})
            },
            valuesInfo: {
                "abstractClass": {
                    type: AutoFormValueType.boolean,
                    label: "Abstract"
                }
            }
        },
        head: {
            value: {
                "headClassId": twinClass.headClassId,
                "headHunterFeaturerId": twinClass.headHunterFeaturerId,
                "headHunterParams": twinClass.headHunterParams
            },
            title: 'Update head',
            onSubmit: (values) => {
                return updateTwinClass({
                    headTwinClassUpdate: {newId: values.headClassId},
                    headHunterFeaturerId: values.headHunterFeaturerId,
                    headHunterParams: values.headHunterParams
                })
            },
            valuesInfo: {
                "headClassId": {
                    type: AutoFormValueType.combobox,
                    label: "Head class",
                    getById: findClassById,
                    getItems: fetchClasses,
                    getItemKey: (c) => c?.id?.toLowerCase() ?? "",
                    getItemLabel: (c) => {
                        let label = c?.key ?? "";
                        if (c.name) label += ` (${c.name})`
                        return label;
                    }
                },
                "headHunterFeaturerId": {
                    type: AutoFormValueType.featurer,
                    label: "Head hunter featurer",
                    paramsName: "headHunterParams",
                    typeId: FeaturerTypes.headHunter
                }
            }
        },
    }

    function openWithSettings(settings: AutoEditDialogSettings) {
        setCurrentAutoEditDialogSettings(settings)
        setEditFieldDialogOpen(true)
    }

    return <>
        <h2 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">General</h2>

        <Table className="mt-8">
            <TableBody>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>{twinClass.id}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Key</TableCell>
                    <TableCell>{twinClass.key}</TableCell>
                </TableRow>
                <TableRow className={"cursor-pointer"} onClick={() => openWithSettings(classValues.name!)}>
                    <TableCell>Name</TableCell>
                    <TableCell>{twinClass.name}</TableCell>
                </TableRow>
                <TableRow className={"cursor-pointer"} onClick={() => openWithSettings(classValues.description!)}>
                    <TableCell>Description</TableCell>
                    <TableCell>{twinClass.description}</TableCell>
                </TableRow>
                <TableRow className={"cursor-pointer"} onClick={() => openWithSettings(classValues.abstractClass!)}>
                    <TableCell>Abstract</TableCell>
                    <TableCell>{twinClass.abstractClass ? "Yes" : "No"}</TableCell>
                </TableRow>
                <TableRow className={"cursor-pointer"} onClick={() => openWithSettings(classValues.head!)}>
                    <TableCell>Head</TableCell>
                    <TableCell>{twinClass.headClassId}</TableCell>
                </TableRow>
                <TableRow className={"cursor-pointer"} onClick={() => openWithSettings(classValues.head!)}>
                    <TableCell>Head Hunter ID</TableCell>
                    <TableCell>{twinClass.headHunterFeaturerId}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Extends</TableCell>
                    <TableCell>{twinClass.extendsClassId}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Created at</TableCell>
                    <TableCell>{twinClass.createdAt}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <AutoDialog
            open={editFieldDialogOpen}
            onOpenChange={setEditFieldDialogOpen}
            settings={currentAutoEditDialogSettings}
        />
    </>
}