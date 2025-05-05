import { useContext } from "react";

import { AttachmentContext } from "@/features/attachment";
import { CommentResourceLink } from "@/features/comment/ui";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinFlowTransitionResourceLink } from "@/features/twin-flow-transition/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
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
              className="text-brand hover:underline"
            >
              {attachment.storageLink}
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
