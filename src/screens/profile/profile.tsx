import { User } from "lucide-react";

// import { useAuthUser } from "@/features/auth";
import { MockTwinAPI } from "@/shared/api";
import { Card, CardContent, CardHeader } from "@/shared/ui";

export function ProfileScreen() {
  // const { authUser } = useAuthUser();

  async function handleSubmit() {
    "use server";

    // @ts-ignore
    MockTwinAPI.GET("https://httpstat.us/401?sleep=1000", {
      params: {
        header: {
          AuthToken: "",
          Channel: "WEB",
          DomainId: "0bc892b6-ef88-47c4-ad92-19cc89576f65",
        },
        query: {},
      },
    });
  }

  return (
    <div className="mt-16 flex h-full justify-center">
      <Card className="flex h-96 w-96 flex-col items-center justify-center text-center">
        <User className="text-brand-500 h-16 w-16" />
        <CardHeader>
          <h2 className="text-2xl font-semibold">
            TESTING!!!!
            {/* {authUser?.domainUser?.user.fullName} */}
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit
            eius autem natus reprehenderit obcaecati, quidem ipsa cupiditate
            temporibus repellat fugiat veritatis enim, tempora quod deserunt
            laudantium earum nemo minima corrupti?
          </p>

          <form action={handleSubmit}>
            <button className="bg-destructive mt-8" type="submit">
              Throw 401
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
