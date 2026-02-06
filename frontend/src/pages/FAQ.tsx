import React, { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, ThumbsUp, ThumbsDown, ArrowLeft, Home } from "lucide-react";
import { faqData, getFaqCategories, searchFaqs } from "../data/faqData";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { cn } from "../lib/utils";
import type { IFaqItem } from "@resumer/shared-types";

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());

  const categories = getFaqCategories();

  const filteredFaqs: IFaqItem[] = searchQuery
    ? searchFaqs(searchQuery)
    : activeCategory
      ? faqData.filter((f) => f.category === activeCategory)
      : faqData;

  const toggleItem = useCallback((id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Track view (fire and forget)
        axiosInstance.post(`/faq/${id}/view`).catch(() => {});
      }
      return next;
    });
  }, []);

  const handleVote = useCallback(
    (id: string, helpful: boolean) => {
      if (votedItems.has(id)) return;
      setVotedItems((prev) => new Set(prev).add(id));
      axiosInstance.post(`/faq/${id}/vote`, { helpful }).catch(() => {});
    },
    [votedItems],
  );

  // Reset category when searching
  useEffect(() => {
    if (searchQuery) setActiveCategory(null);
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto px-4 py-16 w-full">        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <Home className="h-4 w-4" />
          Back to Home
        </button>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Find answers to common questions about Resumer.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              !activeCategory
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openItems.has(faq.id);
            const hasVoted = votedItems.has(faq.id);

            return (
              <div
                key={faq.id}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-muted/50 transition-colors"
                  onClick={() => toggleItem(faq.id)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 ml-4 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>

                    {/* Vote */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                      <span className="text-xs text-muted-foreground">
                        Was this helpful?
                      </span>
                      <button
                        className={cn(
                          "p-1 rounded hover:bg-muted transition-colors",
                          hasVoted && "opacity-50 cursor-not-allowed",
                        )}
                        onClick={() => handleVote(faq.id, true)}
                        disabled={hasVoted}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className={cn(
                          "p-1 rounded hover:bg-muted transition-colors",
                          hasVoted && "opacity-50 cursor-not-allowed",
                        )}
                        onClick={() => handleVote(faq.id, false)}
                        disabled={hasVoted}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No questions found matching your search.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
