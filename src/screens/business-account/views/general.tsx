import { useContext } from "react";

import { TwinClassSchema_DETAILED } from "@/entities/twin-class-schema";
import { TwinFlowSchema_DETAILED } from "@/entities/twinFlowSchema";
import { BusinessAccountContext } from "@/features/business-account";
import { BusinessAccountResourceLink } from "@/features/business-account/ui";
import { NotificationSchemaResourceLink } from "@/features/notification-schema/ui";
import { PermissionSchemaResourceLink } from "@/features/permission-schema/ui";
import { TierResourceLink } from "@/features/tier/ui";
import { TwinClassSchemaResourceLink } from "@/features/twin-class-schema/ui";
import { TwinFlowSchemaResourceLink } from "@/features/twin-flow-schema/ui";
import { formatIntlDate } from "@/shared/libs";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function BusinessAccountGeneral() {
  const { businessAccount } = useContext(BusinessAccountContext);

  return (
    <Table className="mt-8">
      <TableBody>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>
            <GuidWithCopy value={businessAccount.id} variant="long" />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Business Account</TableCell>
          <TableCell>
            {businessAccount.businessAccount && (
              <BusinessAccountResourceLink
                data={businessAccount.businessAccount}
                withTooltip
              />
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Permission Schema</TableCell>
          <TableCell>
            {businessAccount.permissionSchema && (
              <PermissionSchemaResourceLink
                data={businessAccount.permissionSchema}
                withTooltip
              />
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Twinflow Schema</TableCell>
          <TableCell>
            {businessAccount.twinflowSchema && (
              <TwinFlowSchemaResourceLink
                data={businessAccount.twinflowSchema as TwinFlowSchema_DETAILED}
                withTooltip
              />
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Twin Class Schema</TableCell>
          <TableCell>
            {businessAccount.twinClassSchema && (
              <TwinClassSchemaResourceLink
                data={
                  businessAccount.twinClassSchema as TwinClassSchema_DETAILED
                }
                withTooltip
              />
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Tier</TableCell>
          <TableCell>
            {businessAccount.tier && (
              <TierResourceLink data={businessAccount.tier} withTooltip />
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Created At</TableCell>
          <TableCell>
            {businessAccount.createdAt &&
              formatIntlDate(businessAccount.createdAt, "datetime-local")}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Attachments Storage Used Count</TableCell>
          <TableCell>{businessAccount.attachmentsStorageUsedCount}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Attachments Storage Used Size</TableCell>
          <TableCell>{businessAccount.attachmentsStorageUsedSize}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Twins Count</TableCell>
          <TableCell>{businessAccount.twinsCount}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Active Users Count</TableCell>
          <TableCell>{businessAccount.activeUsersCount}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Notification Schema</TableCell>
          <TableCell>
            {businessAccount.notificationSchema && (
              <NotificationSchemaResourceLink
                data={businessAccount.notificationSchema}
                withTooltip
              />
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
