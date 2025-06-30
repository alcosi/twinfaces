import { TwinFieldContextProvider } from "@/features/twin-class-field";
import { TwinClassFieldScreen } from "@/screens/twin-class-field";

type Props = {
  params: {
    twinFieldId: string;
  };
};

export default function Page({ params: { twinFieldId } }: Props) {
  return (
    <TwinFieldContextProvider twinFieldId={twinFieldId}>
      <TwinClassFieldScreen />
    </TwinFieldContextProvider>
  );
}
