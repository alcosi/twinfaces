import { useContext } from "react";

import { Comment_DETAILED } from "@/entities/comment";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { TwinFlowTransition_DETAILED } from "@/entities/twin-flow-transition";
import { AttachmentContext } from "@/features/attachment";
import { CommentResourceLink } from "@/features/comment/ui";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinFlowTransitionResourceLink } from "@/features/twin-flow-transition/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import { formatIntlDate } from "@/shared/libs";
import { AnchorWithCopy } from "@/shared/ui";
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
          <TableCell>Title</TableCell>
          <TableCell>
            <AnchorWithCopy
              href={attachment.storageLink}
              className="max-w-lg truncate"
            >
              {attachment.title}
            </AnchorWithCopy>
          </TableCell>
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
                data={attachment.twinClassField as TwinClassField_DETAILED}
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
                data={
                  attachment.twinflowTransition as TwinFlowTransition_DETAILED
                }
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
              <CommentResourceLink
                data={attachment.comment as Comment_DETAILED}
              />
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
          <TableCell>
            {formatIntlDate(attachment.createdAt, "datetime-local")}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
