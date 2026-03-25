import React, { FC, useRef, useEffect, useState } from "react";
import { ApiMagicFix } from "@/api/magic-fix";

interface CustomEditorProps {
  value: string;
  onChange: (content: string) => void;
  error?: string;
}

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

  // --- NEW AI STATES ---
  const [isFixing, setIsFixing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");

  useEffect(() => {
    const editor = editableRef.current;
    if (editor && editor.innerHTML !== value && !isFixing) {
      editor.innerHTML = value || "<div><br></div>";
      updateToolbar();
    }
  }, [value, isFixing]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    triggerChange();
    updateToolbar();
  };

  const triggerChange = () => { if (editableRef.current) onChange(editableRef.current.innerHTML); };
  const handleInput = () => { triggerChange(); };

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
      while (node && node.nodeName !== "A") node = node.parentNode;
      if (node && node.nodeName === "A") return (node as HTMLAnchorElement).href;
    }
    return "";
  };

  // --- AI FUNCTION ---
  // --- AI FUNCTION ---
  const handleMagicFix = async () => {
    const editor = editableRef.current;
    if (!editor) return;

    const currentHtml = editor.innerHTML;
    // Don't call API if editor is empty
    if (!currentHtml || currentHtml === "<div><br></div>") return;

    setIsFixing(true);
    setAiFeedback("✨ Polishing your text...");

    try {
      const response = await ApiMagicFix({
        text: currentHtml,
        instruction: "Fix grammar, spelling, and flow. MUST preserve all existing HTML tags and formatting."
      });

      // ✅ FIX: Access the nested 'data' object
      if (response && response.data && response.data.editedText) {
        editor.innerHTML = response.data.editedText;
        triggerChange(); // Updates the form state
        setAiFeedback(`${response.data.explanation || "Text improved!"}`);
      }
    } catch (error) {
      console.error("Magic Fix failed:", error);
      setAiFeedback("Failed to apply Magic Fix.");
    } finally {
      setIsFixing(false);
      setTimeout(() => setAiFeedback(""), 4000);
    }
  };

  const btnBase = "text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 border border-border/40 hover:bg-primary/10";
  const activeClass = "bg-primary text-primary-foreground border-primary";
  const inactiveClass = "bg-background/50 text-foreground";

  return (
    <div className="flex flex-col gap-3">
      <style>{`
        .se-editable h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
        .se-editable h2 { font-size: 1.5em; font-weight: bold; margin: 0.83em 0; }
        .se-editable h3 { font-size: 1.17em; font-weight: bold; margin: 1em 0; }
        .se-editable ul { list-style-type: disc; margin: 1em 0 1em 1.5em; }
        .se-editable ol { list-style-type: decimal; margin: 1em 0 1em 1.5em; }
        .se-editable li { margin-bottom: 0.5em; }
        .se-editable a { color: hsl(var(--primary)); text-decoration: underline; }
      `}</style>

      {/* Floating Glass Toolbar */}
      <div className="flex flex-wrap items-center gap-2 bg-card/40 backdrop-blur-md p-2 px-3 rounded-3xl border border-border/50 shadow-sm">
        <button type="button" onClick={() => execCommand("bold")} className={`${btnBase} ${boldActive ? activeClass : inactiveClass}`}>B</button>
        <button type="button" onClick={() => execCommand("italic")} className={`${btnBase} ${italicActive ? activeClass : inactiveClass}`}>I</button>
        <button type="button" onClick={() => execCommand("underline")} className={`${btnBase} ${underlineActive ? activeClass : inactiveClass}`}>U</button>
        <button type="button" onClick={() => execCommand("strikeThrough")} className={`${btnBase} ${strikeActive ? activeClass : inactiveClass}`}>S</button>

        <select
          onChange={(e) => execCommand("formatBlock", e.target.value)}
          value={currentHeading}
          className="text-xs font-semibold bg-background/50 text-foreground border border-border/40 rounded-full px-3 py-1.5 min-w-[100px] outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <button type="button" onClick={() => execCommand("insertOrderedList")} className={`${btnBase} ${olActive ? activeClass : inactiveClass}`}>OL</button>
        <button type="button" onClick={() => execCommand("insertUnorderedList")} className={`${btnBase} ${ulActive ? activeClass : inactiveClass}`}>UL</button>
        <button type="button" onClick={() => {
          const currentUrl = getCurrentLink();
          const promptUrl = prompt("Enter URL", currentUrl);
          if (promptUrl === null) return;
          if (promptUrl === "") { if (linkActive) execCommand("unlink"); }
          else { execCommand("createLink", promptUrl); }
        }}
                className={`${btnBase} ${linkActive ? activeClass : inactiveClass}`}
        >Link</button>

        <div className="flex items-center gap-1 bg-background/50 border border-border/40 rounded-full px-2 py-1">
          <input type="color" onChange={(e) => execCommand("foreColor", e.target.value)} className="w-5 h-5 p-0 border-0 rounded-full cursor-pointer bg-transparent" title="Text Color" />
          <input type="color" onChange={(e) => execCommand("hiliteColor", e.target.value)} className="w-5 h-5 p-0 border-0 rounded-full cursor-pointer bg-transparent" title="Highlight Color" />
        </div>

        <div className="flex gap-1 ml-auto">
          <button type="button" onClick={() => execCommand("undo")} className={btnBase}>Undo</button>
          <button type="button" onClick={() => execCommand("redo")} className={btnBase}>Redo</button>

          {/* --- NEW AI BUTTON --- */}
          <button
            type="button"
            onClick={handleMagicFix}
            disabled={isFixing}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors duration-200 border border-purple-500/40 bg-purple-500/10 text-purple-600 hover:bg-purple-500 hover:text-white flex items-center gap-1 ${isFixing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isFixing ? (
              <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : "✨ Magic Fix"}
          </button>
        </div>
      </div>

      {/* --- AI FEEDBACK TEXT --- */}
      {aiFeedback && (
        <div className="text-xs text-purple-600 font-medium px-2 animate-pulse">
          {aiFeedback}
        </div>
      )}

      {/* Editable Area */}
      <div
        ref={editableRef}
        className="se-editable p-5 rounded-3xl bg-background/20 backdrop-blur-md text-foreground min-h-[250px] border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
        contentEditable={!isFixing} // Disable typing while AI is fixing
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={updateToolbar}
        onKeyUp={updateToolbar}
        onMouseUp={updateToolbar}
        onClick={updateToolbar}
        style={{ outline: "none", textAlign: "left" }}
      />
      {error && <p className="text-xs text-destructive px-2">{error}</p>}
    </div>
  );
};

export default CustomEditor;