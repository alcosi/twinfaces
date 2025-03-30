import { TwinScreen } from "@/screens/twin";

type Props = {
  params: {
    twinId: string;
  };
};

export default function TwinLayout({ params }: Props) {
  return <TwinScreen {...params} />;
}
