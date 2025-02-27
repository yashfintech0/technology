"use client";

import { useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import RenderElement from "./render-elements";
import RenderLeafs from "./render-leaf";

interface ViewEditorProps {
  content: Descendant[];
}

export default function ViewEditor({ content }: ViewEditorProps) {
  const editor = useMemo(() => withReact(createEditor()), []);

  return (
    <Slate initialValue={content} editor={editor}>
      <Editable
        renderElement={RenderElement}
        renderLeaf={RenderLeafs}
        className="my-5"
        readOnly
      />
    </Slate>
  );
}
