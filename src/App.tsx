import { createContext, useEffect, useId, useMemo, useState } from "react";
import { defaultContent } from "./constants";
import TipTapEditor from "./Editor";
import "./App.css";

type TipTapContextEntity = {
  content: Record<string, any>;
  setContent?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

export const TipTapContext = createContext<TipTapContextEntity>(
  {} as TipTapContextEntity
);

function App() {
  const [content, setContent] = useState<Record<string, any>>(defaultContent);

  useEffect(() => {
    console.log("content");
  }, [content]);

  // const contextValue = useMemo(() => ({ content, setContent }), [content]);

  return (
    // <TipTapContext.Provider value={{ content, setContent }}>
    <div className="layout">
      <div>
        <h2>Preview</h2>
        <TipTapEditor
          // key={id}
          isEditing={false}
          variant="preview"
          content={content}
          setContent={setContent}
        />
      </div>
      <div>
        <h2>Editor</h2>
        <TipTapEditor
          // key={id}
          variant="editor"
          content={content}
          setContent={setContent}
        />
      </div>
    </div>
    // </TipTapContext.Provider>
  );
}

export default App;
