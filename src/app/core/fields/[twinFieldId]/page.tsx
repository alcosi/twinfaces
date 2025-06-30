import { TwinFieldContextProvider } from "@/features/twin-class-field";
import { TwinClassFieldScreen } from "@/screens/twin-class-field";

type Props = {
  params: {
    twinFieldId: string;
  };
};

export default function Page({ params: { twinFieldId } }: Props) {
  // TODO:
  // call `fetchTwinFieldById` to fetch `twinField` by `twinFieldId`
  // and ->
  // return (
  //   <TwinClassFieldScreen twinFieldId={twinFieldId} twinField={twinField} />
  // );

  return (
    <TwinFieldContextProvider twinFieldId={twinFieldId}>
      <TwinClassFieldScreen />
    </TwinFieldContextProvider>
  );
}
