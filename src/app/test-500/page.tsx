import { loginAuthAction } from "@/entities/user/server";
import { Error500 } from "@/screens/error-500";
import { unwrapErrorInfo } from "@/shared/libs";

export default async function Page() {
  const formData = new FormData();
  formData.set("domainId", "0bc892b6-ef88-47c4-ad92-19cc89576f65");
  formData.set("username", "some@email.com");
  formData.set("password", "some-fake-invalid-password");

  try {
    await loginAuthAction(null, formData);
    // throw new Error("This is artificial error! For testing purposes");
  } catch (error) {
    const result = unwrapErrorInfo(error);

    return <Error500 error={result} />;
  }
}
