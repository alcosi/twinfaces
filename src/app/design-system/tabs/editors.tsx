"use client";

import { useState } from "react";

import { HTMLEditor, HTMLPreview, RichTextEditor } from "@/features/editors";
import { Button, Separator } from "@/shared/ui";

import { MOCK_HTML } from "../seeds";

export function EditorsTab() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="py-6">
      <RichTextEditor
        mode="html"
        initialHTML={MOCK_HTML}
        onHtmlChange={(html) => {
          console.log("HTML", html);
        }}
      />

      <Separator className="my-8" />

      <Button
        variant="secondary"
        size="sm"
        onClick={() => setShowEditor((prev) => !prev)}
      >
        {showEditor ? "Hide" : "Show"}
      </Button>
      <div className="w-full">
        {showEditor ? (
          <HTMLEditor initialHTML={MOCK_HTML} />
        ) : (
          <HTMLPreview source={MOCK_HTML} />
        )}
      </div>
    </div>
  );
}
