import { UserContextProvider } from "@/features/user";
import { UserScreen } from "@/screens/user";

type Props = {
  params: {
    userId: string;
  };
};

export default function Page({ params: { userId } }: Props) {
  return (
    <UserContextProvider userId={userId}>
      <UserScreen />
    </UserContextProvider>
  );
}
