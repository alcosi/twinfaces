import { DOMExportOutput, DecoratorNode, SerializedLexicalNode } from "lexical";
import React from "react";

type SerializedImageNode = {
  type: "image";
  version: 1;
  src: string;
  alt: string;
} & SerializedLexicalNode;

export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string;
  __alt: string;

  static getType() {
    return "image";
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  constructor(src: string, alt = "", key?: string) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      type: "image",
      version: 1,
      src: this.__src,
      alt: this.__alt,
    };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, alt } = serializedNode;
    return new ImageNode(src, alt);
  }

  createDOM(): HTMLElement {
    const img = document.createElement("img");
    img.src = this.__src;
    img.alt = this.__alt;
    img.style.maxWidth = "100%";
    return img;
  }

  updateDOM() {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__alt);
    return { element };
  }

  static importDOM(): any {
    return {
      img: (domNode: HTMLElement) => {
        const src = domNode.getAttribute("src");
        const alt = domNode.getAttribute("alt") || "";
        if (src != null) {
          return {
            conversion: () => ({
              node: new ImageNode(src, alt),
            }),
            priority: 1,
          };
        }
        return null;
      },
    };
  }

  decorate(): React.JSX.Element {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={this.__src} alt={this.__alt} className="max-w-full" />;
  }
}

export function $createImageNode(src: string, alt = "") {
  return new ImageNode(src, alt);
}

export function $isImageNode(node: unknown): node is ImageNode {
  return node instanceof ImageNode;
}
