import {TwinClass} from "@/lib/api/api-types";
import {Table, TableCell, TableRow} from "@/components/ui/table";

export function TwinClassGeneral({twinClass}: { twinClass: TwinClass }) {

    return <>
        <h2 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">General</h2>

        <Table className="mt-8">
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>{twinClass.id}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>{twinClass.key}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{twinClass.name}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{twinClass.description}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Abstract</TableCell>
                <TableCell>{twinClass.abstractClass ? "Yes" : "No"}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Created at</TableCell>
                <TableCell>{twinClass.createdAt}</TableCell>
            </TableRow>
        </Table>
    </>
}