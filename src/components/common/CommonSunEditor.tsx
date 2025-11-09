import React, { FC, useRef, useEffect, useState } from "react";

interface CustomEditorProps {
  value: string;
  onChange: (content: string) => void;
  error?: string;
}

// TODO: able to add image

const CustomEditor: FC<CustomEditorProps> = ({ value, onChange, error }) => {
  const editableRef = useRef<HTMLDivElement>(null);
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);
  const [strikeActive, setStrikeActive] = useState(false);
  const [olActive, setOlActive] = useState(false);
  const [ulActive, setUlActive] = useState(false);
  const [linkActive, setLinkActive] = useState(false);
  const [currentHeading, setCurrentHeading] = useState("p");

  useEffect(() => {
    const editor = editableRef.current;
    if (editor && editor.innerHTML !== value) {
      editor.innerHTML = value || "<div><br></div>";
      updateToolbar();
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    triggerChange();
    updateToolbar();
  };

  const triggerChange = () => {
    if (editableRef.current) onChange(editableRef.current.innerHTML);
  };

  const handleInput = () => {
    triggerChange();
  };

  const updateToolbar = () => {
    setBoldActive(document.queryCommandState("bold"));
    setItalicActive(document.queryCommandState("italic"));
    setUnderlineActive(document.queryCommandState("underline"));
    setStrikeActive(document.queryCommandState("strikeThrough"));
    setOlActive(document.queryCommandState("insertOrderedList"));
    setUlActive(document.queryCommandState("insertUnorderedList"));
    setLinkActive(document.queryCommandEnabled("unlink"));
    const heading = document.queryCommandValue("formatBlock").toLowerCase();
    setCurrentHeading(heading || "p");
  };

  const getCurrentLink = (): string => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let node: Node | null = range.commonAncestorContainer;
      while (node && node.nodeName !== "A") {
        node = node.parentNode;
      }
      if (node && node.nodeName === "A") {
        return (node as HTMLAnchorElement).href;
      }
    }
    return "";
  };

  return (
    <div className="flex flex-col gap-2">
      <style>{`
        .se-editable h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        .se-editable h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        .se-editable h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .se-editable ul {
          list-style-type: disc;
          margin-left: 1.5em;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .se-editable ol {
          list-style-type: decimal;
          margin-left: 1.5em;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .se-editable li {
          margin-bottom: 0.5em;
        }
        .se-editable a {
          color: #0000EE;
          text-decoration: underline;
        }
        .se-editable a:visited {
          color: #551A8B;
        }
      `}</style>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 bg-card p-2 rounded-md">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className={`text-card-foreground px-2 py-1 border border-border rounded ${boldActive ? "bg-accent" : ""}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className={`text-card-foreground px-2 py-1 border border-border rounded ${italicActive ? "bg-accent" : ""}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className={`text-card-foreground px-2 py-1 border border-border rounded ${underlineActive ? "bg-accent" : ""}`}
        >
          U
        </button>
        <button
          type="button"
          onClick={() => execCommand("strikeThrough")}
          className={`text-card-foreground px-2 py-1 border border-border rounded ${strikeActive ? "bg-accent" : ""}`}
        >
          S
        </button>
        <select
          onChange={(e) => execCommand("formatBlock", e.target.value)}
          value={currentHeading}
          className="bg-card text-card-foreground border border-border rounded px-2 py-1"
        >
          <option value="p">Paragraph</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className={`text-card-foreground px-2 py-1 border border-border rounded ${olActive ? "bg-accent" : ""}`}
        >
          OL
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className={`text-card-foreground px-2 py-1 border border-border rounded ${ulActive ? "bg-accent" : ""}`}
        >
          UL
        </button>
        <button
          type="button"
          onClick={() => {
            const currentUrl = getCurrentLink();
            const promptUrl = prompt("Enter URL", currentUrl);
            if (promptUrl === null) return;
            if (promptUrl === "") {
              if (linkActive) execCommand("unlink");
            } else {
              execCommand("createLink", promptUrl);
            }
          }}
          className={`text-card-foreground px-2 py-1 border border-border rounded ${linkActive ? "bg-accent" : ""}`}
        >
          Link
        </button>
        <input
          type="color"
          onChange={(e) => execCommand("foreColor", e.target.value)}
          className="w-8 h-8 p-0 border border-border rounded cursor-pointer"
        />
        <input
          type="color"
          onChange={(e) => execCommand("hiliteColor", e.target.value)}
          className="w-8 h-8 p-0 border border-border rounded cursor-pointer"
        />
        <button
          type="button"
          onClick={() => execCommand("undo")}
          className="text-card-foreground px-2 py-1 border border-border rounded"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => execCommand("redo")}
          className="text-card-foreground px-2 py-1 border border-border rounded"
        >
          Redo
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editableRef}
        className="se-editable p-4 rounded-md bg-card text-card-foreground min-h-[200px] border border-border"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={updateToolbar}
        onKeyUp={updateToolbar}
        onMouseUp={updateToolbar}
        onClick={updateToolbar}
        style={{
          outline: "none",
          textAlign: "left",
          direction: "ltr",
          caretColor: "var(--foreground)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          display: "block",
        }}
      />

      {error && <p className="text-xs text-red-800">{error}</p>}
    </div>
  );
};

export default CustomEditor;
