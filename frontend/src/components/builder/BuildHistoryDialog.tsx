import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
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
import { useBuildStore } from "../../store/Build.store";
import { Loader2, FileText, Trash2, Clock, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";

interface BuildHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BuildHistoryDialog: React.FC<BuildHistoryDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const {
    buildHistory,
    isLoadingBuildHistory,
    fetchBuildHistory,
    loadBuildById,
    deleteBuild,
    currentBuildId,
  } = useBuildStore();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Fetch history when dialog opens
  useEffect(() => {
    if (open && !buildHistory) {
      fetchBuildHistory();
    }
  }, [open, buildHistory, fetchBuildHistory]);

  // Format date relative to now
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleLoad = async (id: string) => {
    setLoadingId(id);
    const success = await loadBuildById(id);
    setLoadingId(null);
    if (success) {
      onOpenChange(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteBuild(deleteId);
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Resume History</DialogTitle>
            <DialogDescription>
              Load a previous resume or start fresh
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {isLoadingBuildHistory ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !buildHistory || buildHistory.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No saved resumes yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Your resumes will be automatically saved as you work
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {buildHistory.map((build) => {
                  const isCurrentBuild = currentBuildId === build._id;
                  const isLoading = loadingId === build._id;

                  return (
                    <div
                      key={build._id}
                      className={cn(
                        "group flex items-center gap-4 p-4 rounded-lg border transition-colors",
                        isCurrentBuild
                          ? "border-primary/50 bg-primary/5"
                          : "border-border hover:border-primary/30 hover:bg-accent/50"
                      )}
                    >
                      {/* Thumbnail or placeholder */}
                      <div className="w-16 h-20 rounded bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {build.thumbnail ? (
                          <img
                            src={build.thumbnail}
                            alt={build.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="h-6 w-6 text-muted-foreground/50" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground truncate">
                            {build.title}
                          </h4>
                          {isCurrentBuild && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Updated {formatDate(build.updatedAt)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground/70 mt-1 capitalize">
                          Template: {build.templateId || "Default"}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!isCurrentBuild && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLoad(build._id)}
                            disabled={isLoading}
                            className="gap-1.5"
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ExternalLink className="h-4 w-4" />
                            )}
                            Load
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(build._id)}
                          disabled={isCurrentBuild}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && handleDeleteCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this resume. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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

export default BuildHistoryDialog;
