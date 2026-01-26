import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "../../../lib/utils";

interface SkillPillProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
  isFocused?: boolean;
  className?: string;
}

/**
 * Editable skill pill component
 * Displays as a pill, becomes an input when clicked
 */
const SkillPill: React.FC<SkillPillProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  autoFocus = false,
  placeholder = "Skill",
  isFocused = false,
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState(autoFocus);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if ((isEditing || autoFocus) && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, autoFocus]);

  const handleClick = () => {
    setIsEditing(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
    onBlur?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleFocus = () => {
    onFocus?.();
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={cn(
          "px-2 py-0.5 text-sm bg-gray-100 border border-blue-400 rounded-full outline-none min-w-[60px]",
          "focus:ring-2 focus:ring-blue-300",
          className,
        )}
        style={{ width: `${Math.max(60, localValue.length * 8 + 20)}px` }}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      className={cn(
        "px-2 py-0.5 text-sm bg-gray-100 text-gray-700 rounded-full cursor-text transition-all",
        "hover:bg-gray-200",
        isFocused && "ring-2 ring-blue-400 bg-blue-50",
        !value && "text-gray-400 italic",
        className,
      )}
    >
      {value || placeholder}
    </span>
  );
};

export default SkillPill;
