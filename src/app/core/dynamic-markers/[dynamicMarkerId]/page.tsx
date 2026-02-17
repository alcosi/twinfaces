import { TwinClassDynamicMarkerContextProvider } from "@/features/twin-class-dynamic-marker";
import { TwinClassDynamicMarkerScreen } from "@/screens/twin-class-dynamic-marker";

type Props = {
  params: Promise<{
    dynamicMarkerId: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { dynamicMarkerId } = params;

  return (
    <TwinClassDynamicMarkerContextProvider dynamicMarkerId={dynamicMarkerId}>
      <TwinClassDynamicMarkerScreen />
    </TwinClassDynamicMarkerContextProvider>
  );
}
