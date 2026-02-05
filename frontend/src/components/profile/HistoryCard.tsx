import React, { useState } from "react";
import { FileText, Calendar, TrendingUp, Trash2, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { cn } from "../../lib/utils";

export type HistoryCardType = "analysis" | "optimization" | "build";

export interface HistoryCardItem {
  _id: string;
  originalName?: string;
  title?: string;
  atsScore?: number;
  createdAt: string;
  updatedAt?: string;
  thumbnail?: string | null;
  type?: "analysis" | "optimization";
  templateId?: string;
}

interface HistoryCardProps {
  item: HistoryCardItem;
  cardType: HistoryCardType;
  onClick?: () => void;
  onDelete?: (id: string) => void;
  onNavigate?: () => void;
  showDeleteButton?: boolean;
  isLarge?: boolean;
  className?: string;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  item,
  cardType,
  onClick,
  onDelete,
  onNavigate,
  showDeleteButton = true,
  isLarge = false,
  className,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const displayName = item.originalName || item.title || "Untitled";
  const displayDate = item.updatedAt || item.createdAt;
  const score = item.atsScore ?? 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10 text-green-500 border-green-500/20";
    if (score >= 60) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-red-500/10 text-red-500 border-red-500/20";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const getTypeLabel = () => {
    if (cardType === "build") return "Resume Build";
    if (cardType === "optimization") return "Optimization";
    return "Analysis";
  };

  const getTypeIcon = () => {
    if (cardType === "optimization") return <Sparkles className="w-3 h-3" />;
    return <FileText className="w-3 h-3" />;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete?.(item._id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "cursor-pointer group relative rounded-xl transition-all duration-200 hover:shadow-lg bg-card border border-border",
          isLarge && "md:col-span-2",
          className
        )}
      >
        {/* Delete Button */}
        {showDeleteButton && isHovered && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Navigate Button (for optimization history) */}
        {onNavigate && isHovered && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-10 z-10 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate();
            }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        )}

        <div className="p-4">
          {/* Thumbnail */}
          <div className="flex flex-1 w-full h-24 min-h-[6rem] rounded-lg bg-gradient-to-br from-muted to-background border border-border items-center justify-center group-hover:scale-[1.02] transition-transform duration-200 overflow-hidden relative mb-3">
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt="Resume Thumbnail"
                loading="lazy"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
            ) : (
              <FileText className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>

          {/* Title Row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <span
              className="truncate font-semibold text-base flex-1"
              title={displayName}
            >
              {displayName}
            </span>
            {cardType !== "build" && score > 0 && (
              <Badge
                variant="secondary"
                className={cn("whitespace-nowrap", getScoreColor(score))}
              >
                Score: {score}
              </Badge>
            )}
          </div>

          {/* Type Badge */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            {getTypeIcon()}
            <span>{getTypeLabel()}</span>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
              <Calendar size={12} />
              {new Date(displayDate).toLocaleDateString()}
            </div>
            {cardType !== "build" && score > 0 && (
              <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                <TrendingUp size={12} />
                {getScoreLabel(score)}
              </div>
            )}
            {cardType === "build" && item.templateId && (
              <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                <span className="capitalize">{item.templateId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {getTypeLabel()}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{displayName}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HistoryCard;
