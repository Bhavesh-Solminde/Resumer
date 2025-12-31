import React from "react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useBuildStore } from "../../store/Build.store";
import {
  Undo2,
  Redo2,
  Plus,
  ArrowUpDown,
  Layout,
  Palette,
  Sparkles,
  LucideIcon,
} from "lucide-react";

type PanelType =
  | "addSection"
  | "rearrange"
  | "templates"
  | "design"
  | "branding"
  | null;

interface BaseTool {
  id: string;
  label: string;
}

interface ActionTool extends BaseTool {
  type?: never;
  icon: LucideIcon;
  action: () => void;
  panel?: never;
  disabled?: boolean;
}

interface PanelTool extends BaseTool {
  type?: never;
  icon: LucideIcon;
  action?: never;
  panel: PanelType;
  disabled?: never;
}

interface DividerTool {
  id: string;
  type: "divider";
}

type Tool = ActionTool | PanelTool | DividerTool;

const BuilderSidebar: React.FC = () => {
  const { activePanel, setActivePanel, canUndo, canRedo, undo, redo } =
    useBuildStore();

  const tools: Tool[] = [
    {
      id: "undo",
      icon: Undo2,
      label: "Undo",
      action: undo,
      disabled: !canUndo(),
    },
    {
      id: "redo",
      icon: Redo2,
      label: "Redo",
      action: redo,
      disabled: !canRedo(),
    },
    { id: "divider1", type: "divider" },
    { id: "addSection", icon: Plus, label: "Add Section", panel: "addSection" },
    {
      id: "rearrange",
      icon: ArrowUpDown,
      label: "Rearrange",
      panel: "rearrange",
    },
    { id: "templates", icon: Layout, label: "Templates", panel: "templates" },
    { id: "design", icon: Palette, label: "Design & Font", panel: "design" },
    { id: "divider2", type: "divider" },
    { id: "branding", icon: Sparkles, label: "Branding", panel: "branding" },
  ];

  const handleToolClick = (tool: ActionTool | PanelTool) => {
    if ("action" in tool && tool.action) {
      tool.action();
    } else if ("panel" in tool && tool.panel) {
      setActivePanel(activePanel === tool.panel ? null : tool.panel);
    }
  };

  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-1 bg-card border border-border rounded-xl p-2 shadow-lg">
      {tools.map((tool) => {
        if (tool.type === "divider") {
          return <div key={tool.id} className="h-px bg-border my-1 mx-2" />;
        }

        const Icon = tool.icon;
        const isActive = "panel" in tool && activePanel === tool.panel;

        return (
          <Button
            key={tool.id}
            variant={isActive ? "default" : "ghost"}
            size="icon"
            disabled={"disabled" in tool ? tool.disabled : false}
            onClick={() => handleToolClick(tool)}
            className={cn(
              "relative group transition-all duration-200",
              isActive && "bg-primary text-primary-foreground"
            )}
            title={tool.label}
          >
            <Icon className="h-5 w-5" />
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-md border border-border transition-opacity">
              {tool.label}
            </span>
          </Button>
        );
      })}
    </aside>
  );
};

export default BuilderSidebar;
