import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { UNICODE_SYMBOLS } from "@/shared/libs";
import { Button } from "@/shared/ui";

export function SecretFieldPreview({ value }: { value: string }) {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className="flex flex-1 items-center justify-between">
      <span>
        {visible ? value : UNICODE_SYMBOLS.bullet.repeat(value.length)}
      </span>
      <Button
        size="xs"
        variant="ghost"
        IconComponent={visible ? EyeOff : Eye}
        onClick={(e) => {
          e.stopPropagation();
          setVisible((v) => !v);
        }}
      />
    </div>
  );
}
