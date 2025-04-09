import { useContext } from "react";

import { CommentResourceLink } from "@/entities/comment";
import { PermissionResourceLink } from "@/entities/permission";
import { TwinResourceLink } from "@/entities/twin";
import { TwinClassFieldResourceLink } from "@/entities/twin-class-field";
import { TwinFlowTransitionResourceLink } from "@/entities/twin-flow-transition";
import { UserResourceLink } from "@/entities/user";
import { AttachmentContext } from "@/features/attachment";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";

export function AttachmentGeneral() {
  const { attachment } = useContext(AttachmentContext);

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell width={300}>ID</TableCell>
          <TableCell>
            <GuidWithCopy value={attachment.id} variant="long" />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Twin</TableCell>
          <TableCell>
            <TwinResourceLink data={attachment.twin} withTooltip />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>External Id</TableCell>
          <TableCell>
            <GuidWithCopy value={attachment.externalId} variant="long" />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Link</TableCell>
          <TableCell>
            <a
              href={attachment.storageLink}
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
            >
              <GuidWithCopy value={attachment.storageLink} variant="long" />
            </a>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>{attachment.title}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>{attachment.description}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Field</TableCell>
          <TableCell>
            {attachment.twinClassField && (
              <TwinClassFieldResourceLink
                data={attachment.twinClassField}
                withTooltip
              />
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Transition</TableCell>
          <TableCell>
            {attachment.twinflowTransition && (
              <TwinFlowTransitionResourceLink
                data={attachment.twinflowTransition}
                twinClassId={attachment.twin.twinClassId!}
                twinFlowId={attachment.twinflowTransitionId!}
                withTooltip
              />
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Comment</TableCell>
          <TableCell>
            {attachment.comment && (
              <CommentResourceLink data={attachment.comment} />
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>View permission</TableCell>
          <TableCell>
            {attachment.viewPermission && (
              <PermissionResourceLink data={attachment.viewPermission} />
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Created by</TableCell>
          <TableCell>
            {attachment.authorUser && (
              <UserResourceLink data={attachment.authorUser} withTooltip />
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Created at</TableCell>
          <TableCell>{formatToTwinfaceDate(attachment.createdAt)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
