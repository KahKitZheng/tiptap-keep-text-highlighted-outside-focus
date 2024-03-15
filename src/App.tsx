import { useEffect, useState } from "react";
import { defaultContent } from "./constants";
import TipTapEditor from "./Editor";
import "./App.css";

function App() {
  const [content, setContent] = useState<Record<string, any>>(defaultContent);

  useEffect(() => {
    console.log("content");
  }, [content]);

  return (
    <div className="layout">
      <div>
        <h2>Preview</h2>
        <TipTapEditor
          isEditing={false}
          variant="preview"
          content={content}
          setContent={setContent}
        />
      </div>
      <div>
        <h2>Editor</h2>
        <TipTapEditor
          variant="editor"
          content={content}
          setContent={setContent}
        />
      </div>
    </div>
  );
}

export default App;
