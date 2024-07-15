import {TwinClass, TwinClassField} from "@/lib/api/api-types";
import {useContext, useEffect, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {toast} from "sonner";
import {LoadingOverlay} from "@/components/ui/loading";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Edit2Icon} from "lucide-react";
import CreateEditTwinFieldDialog from "@/app/twinclass/[key]/twin-field-dialog";

export function TwinClassFields({twinClass}: { twinClass: TwinClass }) {
    const api = useContext(ApiContext);

    const [fields, setFields] = useState<TwinClassField[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [createEditFieldDialogOpen, setCreateEditFieldDialogOpen] = useState<boolean>(false);
    const [editedField, setEditedField] = useState<TwinClassField | null>(null);

    useEffect(() => {
        fetchData();
    }, [])

    function fetchData() {
        if (!twinClass.id) {
            toast.error("Twin class ID is missing");
            return;
        }

        setLoading(true);
        api.twinClass.getFields({id: twinClass.id}).then((response) => {
            const data = response.data;
            if (!data || data.status != 0) {
                console.error('failed to fetch twin class fields', data)
                let message = "Failed to load twin class fields";
                if (data?.msg) message += `: ${data.msg}`;
                toast.error(message);
                return;
            }
            setFields(data.twinClassFieldList ?? []);
        }).catch((e) => {
            console.error('exception while fetching twin class fields', e)
            toast.error("Failed to fetch twin class fields")
        }).finally(() => setLoading(false))
    }

    function createField() {
        setEditedField(null);
        setCreateEditFieldDialogOpen(true);
    }

    function editField(field: TwinClassField) {
        setEditedField(field);
        setCreateEditFieldDialogOpen(true);
    }

    return <>
        {loading && <LoadingOverlay/>}
        <h2>
            Fields
            <Button onClick={createField} className="ml-4">
                Create field
            </Button>
        </h2>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {fields.map((field) => <FieldTableRow key={field.key} field={field} onEdit={editField}/>)}
            </TableBody>
        </Table>

        <CreateEditTwinFieldDialog open={createEditFieldDialogOpen} twinClassId={twinClass.id!} field={editedField}
                                    onOpenChange={setCreateEditFieldDialogOpen}
                                    onSuccess={fetchData}/>
    </>
}

function FieldTableRow({field, onEdit}: { field: TwinClassField, onEdit: (field: TwinClassField) => void }) {
    return <TableRow>
        <TableCell>{field.id}</TableCell>
        <TableCell>{field.key}</TableCell>
        <TableCell>{field.name}</TableCell>
        <TableCell>{field.description}</TableCell>
        <TableCell>{field.required}</TableCell>
        <TableCell>{field.descriptor?.fieldType}</TableCell>

        <TableCell>
            <Button variant="ghost" size="iconTiny" onClick={() => onEdit(field)}><Edit2Icon/></Button>
        </TableCell>
    </TableRow>
}