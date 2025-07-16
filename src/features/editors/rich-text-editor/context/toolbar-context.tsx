"use client";

import { LexicalEditor } from "lexical";
import React, { JSX, createContext, useContext } from "react";

import { BlockKey } from "../plugins/toolbar/block-format/block-format-data";

const Context = createContext<{
  activeEditor: LexicalEditor;
  $updateToolbar: () => void;
  blockType: BlockKey;
  setBlockType: (blockType: BlockKey) => void;
  showModal: (
    title: string,
    showModal: (onClose: () => void) => JSX.Element
  ) => void;
}>({
  activeEditor: {} as LexicalEditor,
  $updateToolbar: () => {},
  blockType: "paragraph",
  setBlockType: () => {},
  showModal: () => {},
});

export function ToolbarContext({
  activeEditor,
  $updateToolbar,
  blockType,
  setBlockType,
  showModal,
  children,
}: {
  activeEditor: LexicalEditor;
  $updateToolbar: () => void;
  blockType: BlockKey;
  setBlockType: (blockType: BlockKey) => void;
  showModal: (
    title: string,
    showModal: (onClose: () => void) => JSX.Element
  ) => void;
  children: React.ReactNode;
}) {
  return (
    <Context.Provider
      value={{
        activeEditor,
        $updateToolbar,
        blockType,
        setBlockType,
        showModal,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useToolbarContext() {
  return useContext(Context);
}
