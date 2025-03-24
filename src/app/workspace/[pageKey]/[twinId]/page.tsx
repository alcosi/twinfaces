import { TwinScreen, TwinScreenParams } from "@/screens/twin";

type Props = {
  params: TwinScreenParams;
};

export default function TwinLayout({ params }: Props) {
  return <TwinScreen {...params} />;
}
