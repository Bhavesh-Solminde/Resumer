import React, {
  useState,
  useRef,
  useEffect,
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

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLocalValue(e.target.value);
  };

  if (isEditing) {
    const InputComponent = multiline ? "textarea" : "input";
    return (
      <InputComponent
        ref={
          inputRef as React.RefObject<HTMLInputElement & HTMLTextAreaElement>
        }
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "bg-transparent border-none outline-none w-full resize-none",
          "focus:ring-1 focus:ring-blue-400 rounded px-1",
          className
        )}
        rows={multiline ? 3 : undefined}
      />
    );
  }

  return (
    <Tag
      onClick={handleClick}
      className={cn(
        "cursor-text hover:bg-gray-100 rounded px-1 transition-colors",
        !value && "text-gray-400 italic",
        className
      )}
    >
      {value || placeholder}
    </Tag>
  );
};

export default EditableText;
