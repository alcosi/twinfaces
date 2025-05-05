import { GuidWithCopy } from "@/shared/ui/guid";

interface Props {
  value: string;
}

export function GuidLink({ value }: Props) {
  return (
    <div onClick={(event) => event.stopPropagation()}>
      <a href={value} className="text-brand hover:underline">
        <GuidWithCopy value={value} />
      </a>
    </div>
  );
}
