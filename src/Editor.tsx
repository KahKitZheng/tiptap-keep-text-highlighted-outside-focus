import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TipTapLink from "./TipTapLink";
import { useEffect, useState } from "react";

type TipTapEditorProps = {
  variant: "preview" | "editor";
  isEditing?: boolean;
  content: Record<string, any>;
  setContent: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

export default function TipTapEditor(props: TipTapEditorProps) {
  const { isEditing = true, content, setContent } = props;

  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });

  const readOnlyEditor = useEditor({
    content: content,
    editable: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Highlight.configure({ HTMLAttributes: {} }),
    ],
    editorProps: {
      attributes: {
        class: "preview",
      },
    },
  });

  const editOnlyEditor = useEditor({
    content: content,
    editable: true,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Highlight.configure({
        HTMLAttributes: {
          class: "selected-text",
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      if (typeof setContent !== "function") {
        return;
      }

      setContent(editor?.getJSON());
    },
    onFocus: ({ editor }) => {
      editor.commands.unsetHighlight();
    },
    editorProps: {
      attributes: {
        class: "editor",
      },
    },
  });

  useEffect(() => {
    readOnlyEditor?.commands.setContent(content);
  }, [content, readOnlyEditor]);

  return (
    <div className="wrapper">
      <EditorContent editor={isEditing ? editOnlyEditor : readOnlyEditor} />
      {isEditing && (
        <TipTapLink
          editor={editOnlyEditor}
          selectionRange={selectionRange}
          setSelectionRange={setSelectionRange}
        />
      )}
    </div>
  );
}
