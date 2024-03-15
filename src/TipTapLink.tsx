import { useCallback, useEffect, useRef, useState } from "react";
import { FaCircleCheck, FaCircleXmark, FaPaperclip } from "react-icons/fa6";
import { Editor } from "@tiptap/react";
import { AnimatePresence, motion } from "framer-motion";
import "./TipTapLink.css";

type TipTapLinkProps = {
  editor: Editor | null;
  selectionRange: {
    start: number;
    end: number;
  };
  setSelectionRange: React.Dispatch<
    React.SetStateAction<{
      start: number;
      end: number;
    }>
  >;
};

export default function TipTapLink(props: TipTapLinkProps) {
  const { editor, selectionRange, setSelectionRange } = props;

  const [url, setUrl] = useState("");
  const [isLinkSelected, setIsLinkSelected] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const selectedTextUrl = editor?.getAttributes("link").href;

  const createLink = useCallback(() => {
    const newLink = { href: url };
    editor?.chain().focus().extendMarkRange("link").setLink(newLink).run();
  }, [editor, url]);

  const deleteLink = useCallback(() => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
  }, [editor]);

  const setLink = useCallback(() => {
    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      deleteLink();
      return;
    }

    // update link
    createLink();
    setIsLinkSelected(false);
  }, [createLink, deleteLink, url]);

  function openUrlEditor() {
    editor
      ?.chain()
      .focus()
      .command(() => {
        setIsLinkSelected(true);
        return true; // can be whatever
      })
      .run();
  }

  function closeUrlEditor() {
    if (url === "") {
      setIsLinkSelected(false);
    } else {
      setIsLinkSelected(false);
      deleteLink();
    }
  }

  function validateUrl() {
    if (url === "") {
      return;
    }
    if (!url.startsWith("https://")) {
      return setUrl(`https://${url}`);
    }
  }

  const handleOnFocus = () => {
    if (!editor) {
      return;
    }

    const { from, to } = editor.state.selection;

    editor.commands.unsetHighlight();

    // Save the selection range
    setSelectionRange({ start: from, end: to });
    editor.commands.setHighlight();

    // editor.commands.setTextSelection({
    //   from: selectionRange.start,
    //   to: selectionRange.end,
    // });
  };

  // useEffect(() => {
  //   if (!editor) {
  //     return;
  //   }
  //   editor.commands.setTextSelection({
  //     from: selectionRange.start,
  //     to: selectionRange.end,
  //   });

  //   editor.commands.unsetHighlight();

  //   // const { from, to } = editor.state.selection;

  //   // editor.commands.unsetHighlight();
  // }, [editor, selectionRange.end, selectionRange.start]);

  // Fill input with selected link
  useEffect(() => {
    setUrl(!selectedTextUrl ? "" : editor?.getAttributes("link").href);
  }, [editor, selectedTextUrl]);

  return (
    <AnimatePresence mode="wait">
      {!isLinkSelected ? (
        <motion.div
          className="common-extension"
          animate={{
            display: "grid",
            placeContent: "center",
            width: "32px",
          }}
          transition={{ duration: 0.3 }}
          onClick={openUrlEditor}
        >
          <FaPaperclip />
        </motion.div>
      ) : (
        <motion.div
          className="link-wrapper"
          animate={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            width: isLinkSelected ? "100%" : "32px",
          }}
          transition={{ duration: 0.3, ease: "linear" }}
        >
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={validateUrl}
            onFocus={handleOnFocus}
            placeholder="https://example.com"
            className="text-input"
          />
          <div className="button-actions">
            <FaCircleCheck onClick={setLink} />
            <FaCircleXmark onClick={closeUrlEditor} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
