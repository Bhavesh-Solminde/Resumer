import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  KeyboardEvent,
  ElementType,
} from "react";
import { cn } from "../../../lib/utils";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  as?: ElementType;
}

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  placeholder = "Click to edit",
  className = "",
  multiline = false,
  as: Tag = "span",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Auto-resize textarea height
  useLayoutEffect(() => {
    if (isEditing && multiline && inputRef.current) {
      const textarea = inputRef.current as HTMLTextAreaElement;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [localValue, isEditing, multiline]);

  // Auto-resize input width
  useLayoutEffect(() => {
    if (isEditing && !multiline && measureRef.current) {
      const width = measureRef.current.offsetWidth + 8; // add small padding
      setInputWidth(Math.max(width, 20)); // minimum width
    }
  }, [localValue, isEditing, multiline]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLocalValue(e.target.value);
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "bg-transparent border-none outline-none w-full resize-none overflow-hidden",
            "focus:ring-1 focus:ring-blue-400 rounded px-1 transition-all",
            className,
          )}
          rows={1}
        />
      );
    }

    return (
      <>
        {/* Hidden measuring element */}
        <span
          ref={measureRef}
          className={cn("absolute invisible whitespace-pre px-1", className)}
          aria-hidden="true"
        >
          {localValue || placeholder}
        </span>
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{ width: inputWidth ? `${inputWidth}px` : undefined }}
          className={cn(
            "bg-transparent border-none outline-none resize-none transition-all",
            "focus:ring-1 focus:ring-blue-400 rounded px-1",
            className,
          )}
        />
      </>
    );
  }

  return (
    <Tag
      onClick={handleClick}
      className={cn(
        "cursor-text hover:bg-gray-100 rounded px-1 transition-colors",
        !value && "text-gray-400 italic",
        className,
      )}
    >
      {value || placeholder}
    </Tag>
  );
};

export default EditableText;
