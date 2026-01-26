import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import EditableText from "./EditableText";

type BulletStyle = "disc" | "circle" | "square" | "dash" | "arrow";

interface BulletEditorProps {
  bullets?: string[];
  onChange: (bullets: string[]) => void;
  bulletStyle?: BulletStyle;
  className?: string;
  placeholder?: string;
  onDelete?: (index: number) => void;
}

const bulletIcons: Record<BulletStyle, string> = {
  disc: "list-disc",
  circle: "list-circle",
  square: "list-square",
  dash: "",
  arrow: "",
};

const getBulletMarker = (style: BulletStyle): string => {
  switch (style) {
    case "dash":
      return "- ";
    case "arrow":
      return "> ";
    default:
      return "";
  }
};

const BulletEditor: React.FC<BulletEditorProps> = ({
  bullets = [],
  onChange,
  bulletStyle = "disc",
  className = "",
  placeholder = "Add description...",
  onDelete,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    onChange(newBullets);
  };

  const handleAddBullet = () => {
    onChange([...bullets, ""]);
  };

  const handleRemoveBullet = (index: number) => {
    if (onDelete) {
      onDelete(index);
    } else {
      const newBullets = bullets.filter((_, i) => i !== index);
      onChange(newBullets);
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      <ul
        className={cn(
          "space-y-0.5 list-outside",
          bulletStyle !== "dash" &&
            bulletStyle !== "arrow" &&
            bulletIcons[bulletStyle],
          bulletStyle !== "dash" && bulletStyle !== "arrow" && "pl-5",
        )}
      >
        {bullets.map((bullet, index) => (
          <li
            key={index}
            className="relative group list-item"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-start gap-1">
              {/* Custom bullet markers */}
              {(bulletStyle === "dash" || bulletStyle === "arrow") && (
                <span className="text-gray-600 select-none">
                  {getBulletMarker(bulletStyle)}
                </span>
              )}

              {/* Bullet text */}
              <div className="flex-1">
                <EditableText
                  value={bullet}
                  onChange={(val) => handleBulletChange(index, val)}
                  placeholder={placeholder}
                  className="text-sm text-gray-700"
                  multiline={true}
                />
              </div>
            </div>

            {/* Hover actions */}
            {hoveredIndex === index && (
              <div className="absolute right-0 top-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRemoveBullet(index)}
                  className="p-0.5 rounded hover:bg-red-50"
                  title="Remove bullet"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Add bullet button */}
      <button
        onClick={handleAddBullet}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 mt-1 ml-4"
      >
        <Plus className="w-3 h-3" />
        <span>Add bullet</span>
      </button>
    </div>
  );
};

export default BulletEditor;
