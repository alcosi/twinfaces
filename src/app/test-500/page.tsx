import { loginAuthAction } from "@/entities/user/server";
import { Error500 } from "@/screens/error-500";
import { errorToResult } from "@/shared/libs";

export default async function Page() {
  const formData = new FormData();
  formData.set("domainId", "0bc892b6-ef88-47c4-ad92-19cc89576f65");
  formData.set("username", "some@email.com");
  formData.set("password", "some-fake-invalid-password");

  try {
    // Variant #1
    const result = await loginAuthAction(null, formData);
    if (!result.ok) {
      throw result.error;
    }

    // Variant #2
    // throw new Error("This is artificial error! For testing purposes");
  } catch (error) {
    const result = errorToResult(error);

    return <Error500 error={result} />;
  }
}
