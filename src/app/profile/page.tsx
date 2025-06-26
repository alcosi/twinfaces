import { getAuthHeaders } from "@/entities/face";
import { UserContextProvider } from "@/features/user";
import { ProfileScreen } from "@/screens/profile";

export default async function Page() {
  const { AuthToken } = await getAuthHeaders();

  return (
    <UserContextProvider userId={AuthToken}>
      <ProfileScreen />
    </UserContextProvider>
  );
}
