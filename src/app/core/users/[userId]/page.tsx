import { use } from "react";

import { UserContextProvider } from "@/features/user";
import { UserScreen } from "@/screens/user";

type Props = {
  params: Promise<{ userId: string }>;
};

export default function Page({ params }: Props) {
  const { userId } = use(params);

  return (
    <UserContextProvider userId={userId}>
      <UserScreen />
    </UserContextProvider>
  );
}
