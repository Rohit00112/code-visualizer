"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  activeLine?: number;
}

export function CodeEditor({ code, onChange, activeLine }: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Custom theme for better visuals
    monaco.editor.defineTheme("codevisualizer-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#09090b", // Matches shadcn slate-950
      },
    });
    monaco.editor.setTheme("codevisualizer-dark");
  };

  useEffect(() => {
    if (editorRef.current && activeLine !== undefined) {
      const editor = editorRef.current;
      
      // Remove previous decorations
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);

      // Add new decoration for the active line
      if (activeLine > 0) {
        decorationsRef.current = editor.deltaDecorations([], [
          {
            range: { startLineNumber: activeLine, startColumn: 1, endLineNumber: activeLine, endColumn: 1 },
            options: {
              isWholeLine: true,
              className: "bg-primary/20 border-l-4 border-primary",
              glyphMarginClassName: "active-line-glyph",
            },
          },
        ]);
        
        // Scroll to active line
        editor.revealLineInCenterIfOutsideViewport(activeLine);
      }
    }
  }, [activeLine]);

  return (
    <div className="h-full w-full overflow-hidden border-r">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          padding: { top: 16 },
        }}
      />
    </div>
  );
}
