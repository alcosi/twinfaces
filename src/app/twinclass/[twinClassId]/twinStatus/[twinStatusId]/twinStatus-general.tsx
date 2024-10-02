import React, {useContext, useState} from 'react';
import {TwinClassStatus, TwinClassStatusUpdateRq} from "@/lib/api/api-types";
import {ApiContext} from "@/lib/api/api";
import {AutoDialog, AutoEditDialogSettings} from "@/components/auto-dialog";
import {AutoFormValueType} from "@/components/auto-field";
import {Table, TableBody, TableCell, TableRow} from "@/components/base/table";
import {ColorPicker} from "@/components/base/color-picker";

export function TwinStatusGeneral({status, onChange}: {
    status: TwinClassStatus,
    onChange: () => any
}) {
    const api = useContext(ApiContext);
    const [editStatusDialogOpen, setEditStatusDialogOpen] = useState(false);
    const [currentAutoEditDialogSettings, setCurrentAutoEditDialogSettings] = useState<AutoEditDialogSettings | undefined>(undefined);
    const [color, setColor] = useState(status.color || '#FFFFFF');

    function openWithSettings(settings: AutoEditDialogSettings) {
        setCurrentAutoEditDialogSettings(settings)
        setEditStatusDialogOpen(true)
    }

    async function updateStatus(newStatus: TwinClassStatusUpdateRq) {
        try {
            await api.twinClass.update({id: status.id!, body: newStatus});
            onChange?.();
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    const nameAutoDialogSettings: AutoEditDialogSettings = {
        value: {"name": status.name},
        title: 'Update name',
        onSubmit: (values) => {
            return updateStatus({nameI18n: {translationInCurrentLocale: values.name}})
        },
        valuesInfo: {
            "name": {
                type: AutoFormValueType.string, label: "Name"
            }
        }
    };

    const descriptionAutoDialogSettings: AutoEditDialogSettings = {
        value: {"description": status.description},
        title: 'Update description',
        onSubmit: (values) => {
            return updateStatus({descriptionI18n: {translationInCurrentLocale: values.description}})
        },
        valuesInfo: {
            "description": {
                type: AutoFormValueType.string, label: "Description"
            }
        }
    }

    const handleColorChange = async (newColor: string) => {
        setColor(newColor);
        await updateStatus({color: newColor});
    };


    return <>
        <Table className="mt-8">
            <TableBody>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>{status.id}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Key</TableCell>
                    <TableCell>{status.key}</TableCell>
                </TableRow>
                <TableRow className="cursor-pointer"
                          onClick={() => openWithSettings(nameAutoDialogSettings)}>
                    <TableCell>Name</TableCell>
                    <TableCell>{status.name}</TableCell>
                </TableRow>
                <TableRow className="cursor-pointer"
                          onClick={() => openWithSettings(descriptionAutoDialogSettings)}>
                    <TableCell>Description</TableCell>
                    <TableCell>{status.description}</TableCell>
                </TableRow>
                <TableRow className="cursor-pointer">
                    <TableCell>Color</TableCell>
                    <TableCell><ColorPicker value={color} onChange={handleColorChange}/></TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <AutoDialog
            open={editStatusDialogOpen}
            onOpenChange={setEditStatusDialogOpen}
            settings={currentAutoEditDialogSettings}/>
    </>
}
