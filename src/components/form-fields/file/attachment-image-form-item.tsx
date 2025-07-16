import Image from "next/image";
import { useRef, useState } from "react";

import { ImageCropModal } from "@/features/ui/image-cropper-modal";
import { FormItem, FormMessage } from "@/shared/ui";

import { FormItemDescription, FormItemLabel } from "../form-items-common";
import { FormItemProps } from "../types";

type AttachmentImageFormItemProps = FormItemProps & {
  fieldValue: string;
  onChange?: (value: string) => void;
  invalid?: boolean;
};

export const AttachmentImageFormItem = ({
  label,
  description,
  required,
  inForm,
  fieldValue,
  onChange,
}: AttachmentImageFormItemProps) => {
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleCropComplete(base64Image: string) {
    onChange?.(base64Image);
    setCropModalOpen(false);
    setSelectedFile(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    e.target.value = "";

    if (file) {
      setSelectedFile(file);
      setCropModalOpen(true);
    } else {
      setCropModalOpen(false);
      setSelectedFile(null);
    }
  }

  return (
    <FormItem className="w-full">
      {label && (
        <div className="flex items-center gap-4">
          <FormItemLabel inForm={inForm}>
            {label} {required && <span className="text-destructive">*</span>}
          </FormItemLabel>
        </div>
      )}

      <div className="mt-2 flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border-input bg-background focus:ring-ring block w-full cursor-pointer rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:outline-none"
        />

        {/*
          TODO: https://alcosi.atlassian.net/browse/TWINFACES-605
          when clicking on this image we re-open the ImageCropModal with this fieldValue and allow re-editing
        */}
        {fieldValue && (
          <Image
            src={fieldValue}
            alt="Preview"
            width={48}
            height={48}
            className="h-12 w-12 rounded-sm border object-cover"
          />
        )}
      </div>

      <ImageCropModal
        open={cropModalOpen}
        onOpenChange={setCropModalOpen}
        onCropComplete={handleCropComplete}
        file={selectedFile}
      />

      {description && (
        <FormItemDescription inForm={inForm}>{description}</FormItemDescription>
      )}

      {inForm && <FormMessage />}
    </FormItem>
  );
};
