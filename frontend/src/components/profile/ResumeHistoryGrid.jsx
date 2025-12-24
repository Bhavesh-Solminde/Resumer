import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, TrendingUp } from "lucide-react";

const ResumeHistoryGrid = ({ userResumeHistory, onScanClick }) => {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {(userResumeHistory || []).map((item, i) => (
        <div
          key={item._id}
          // 1. CRITICAL: Pass the ID explicitly and Log it for debugging
          onClick={() => {
            console.log("Card Clicked, ID:", item._id);
            if (item._id) onScanClick(item._id);
            else console.error("Error: Item has no ID", item);
          }}
          // 2. CRITICAL: Move the col-span logic to the WRAPPER, not the inner item
          className={`cursor-pointer group relative rounded-xl transition-all duration-200 hover:shadow-lg ${
            i === 0 || i === 3 ? "md:col-span-2" : ""
          }`}
        >
          <BentoGridItem
            title={
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between w-full">
                  <span
                    className="truncate font-semibold text-base"
                    title={item.originalName}
                  >
                    {item.originalName}
                  </span>
                  <Badge
                    variant={
                      item.atsScore >= 80
                        ? "default"
                        : item.atsScore >= 60
                        ? "secondary"
                        : "destructive"
                    }
                    className={
                      item.atsScore >= 80
                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 whitespace-nowrap"
                        : item.atsScore >= 60
                        ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20 whitespace-nowrap"
                        : "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 whitespace-nowrap"
                    }
                  >
                    Score: {item.atsScore}
                  </Badge>
                </div>
              </div>
            }
            description={
              <div className="space-y-3 mt-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Resume Analysis Result
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                    <Calendar size={12} />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                    <TrendingUp size={12} />
                    {item.atsScore >= 80
                      ? "Excellent"
                      : item.atsScore >= 60
                      ? "Good"
                      : "Needs Improvement"}
                  </div>
                </div>
              </div>
            }
            header={
              <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-muted to-background border border-border items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden relative">
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
            }
            // Remove the className from here, it's now on the wrapper
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      ))}
    </BentoGrid>
  );
};

export default ResumeHistoryGrid;
