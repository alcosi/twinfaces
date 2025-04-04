import { useContext } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { UserResourceLink, useUpdateUser } from "@/entities/user";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { UserContext } from "@/features/user";
import { REGEX_PATTERNS, formatToTwinfaceDate } from "@/shared/libs";
import { Avatar } from "@/shared/ui";
import { GuidWithCopy, Table, TableCell, TableRow } from "@/shared/ui";

export function UserGeneral() {
  const { user, refresh } = useContext(UserContext);
  const { updateUser } = useUpdateUser();

  const nameSettings: InPlaceEditProps<string | undefined> = {
    id: "fullName",
    value: user.user?.fullName,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: async (value) => {
      return updateUser({
        userId: user.userId!,
        body: {
          fullName: value,
        },
      }).then(refresh);
    },
  };

  const emailSettings: InPlaceEditProps<string | undefined> = {
    id: "email",
    value: user.user?.email,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().regex(REGEX_PATTERNS.EMAIL, "Incorrect email format"),
    onSubmit: async (value) => {
      return updateUser({
        userId: user.userId!,
        body: {
          email: value,
        },
      }).then(refresh);
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableRow>
          <TableCell>User ID</TableCell>
          <TableCell>
            <GuidWithCopy value={user.user?.id} variant="long" />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>
            <InPlaceEdit {...nameSettings} />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>
            {user.user && <UserResourceLink data={user.user} />}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Locale</TableCell>
          <TableCell>{user.currentLocale}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Email</TableCell>
          <TableCell>
            <InPlaceEdit {...emailSettings} />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Created at</TableCell>
          <TableCell>{formatToTwinfaceDate(user.createdAt!)}</TableCell>
        </TableRow>

        {/* //TODO add functional to update user avatar */}
        <TableRow>
          <TableCell>Avatar</TableCell>
          <TableCell>
            {user.user?.avatar ? (
              <Avatar url={user.user.avatar} alt={"avatar"} size="xlg" />
            ) : (
              ""
            )}
          </TableCell>
        </TableRow>
      </Table>
    </InPlaceEditContextProvider>
  );
}
