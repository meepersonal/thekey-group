import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading2,
  RemoveFormatting,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastValue = useRef(value);

  // Sync external value changes into the editor
  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== value &&
      lastValue.current !== value
    ) {
      editorRef.current.innerHTML = value || "";
    }
    lastValue.current = value;
  }, [value]);

  const emit = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const exec = (command: string, cmdValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, cmdValue);
    emit();
  };

  const toolbarBtn = (
    label: string,
    icon: React.ReactNode,
    command: string,
    cmdValue?: string
  ) => (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="h-8 w-8"
      title={label}
      onMouseDown={(e) => {
        // Prevent losing focus from the editor
        e.preventDefault();
        exec(command, cmdValue);
      }}
    >
      {icon}
    </Button>
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-background",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-secondary/40 p-1.5">
        {toolbarBtn("Gras", <Bold className="h-4 w-4" />, "bold")}
        {toolbarBtn("Italique", <Italic className="h-4 w-4" />, "italic")}
        {toolbarBtn("Souligné", <Underline className="h-4 w-4" />, "underline")}
        <div className="mx-0.5 h-5 w-px bg-border" />
        {toolbarBtn(
          "Titre",
          <Heading2 className="h-4 w-4" />,
          "formatBlock",
          "h2",
        )}
        {toolbarBtn(
          "Liste à puces",
          <List className="h-4 w-4" />,
          "insertUnorderedList",
        )}
        {toolbarBtn(
          "Liste numérotée",
          <ListOrdered className="h-4 w-4" />,
          "insertOrderedList",
        )}
        {toolbarBtn("Citation", <Quote className="h-4 w-4" />, "formatBlock", "blockquote")}
        <div className="mx-0.5 h-5 w-px bg-border" />
        {toolbarBtn(
          "Effacer la mise en forme",
          <RemoveFormatting className="h-4 w-4" />,
          "removeFormat",
        )}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[160px] max-h-[400px] overflow-y-auto p-4 text-sm leading-relaxed text-foreground outline-none focus:ring-1 focus:ring-ring"
        aria-label="Éditeur de description"
        onInput={emit}
        onMouseUp={emit}
        onKeyDown={emit}
        dangerouslySetInnerHTML={{ __html: value || "" }}
      />
    </div>
  );
}