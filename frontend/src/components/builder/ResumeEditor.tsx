import React from "react";
import { useShallow } from "zustand/react/shallow";
import { useBuildStore } from "../../store/Build.store";
import { cn } from "../../lib/utils";
import { getSectionComponent, DEFAULT_TEMPLATE } from "./templates";
import { ConfirmDialog } from "./shared";
import type {
  Section as SharedSection,
  SectionSettingsMap,
} from "@resumer/shared-types";

// Fallback imports for legacy section types
import { GenericSection } from "./sections/SectionComponents";

// Local Section type for flexibility
interface Section {
  id: string;
  type: string;
  data: unknown;
}

interface PaginatedSection extends Section {
  hideHeader?: boolean;
  displayItemIndices?: number[];
}

interface Theme {
  pageMargins?: number;
  sectionSpacing?: number;
  fontSize?: string;
  fontFamily?: string;
  lineHeight?: number;
  primaryColor?: string;
  background?: string;
}

interface ConfirmDialogState {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const marginMap: Record<number, string> = {
  1: "px-6",
  2: "px-10",
  3: "px-14",
  4: "px-20",
};

const spacingMap: Record<number, string> = {
  1: "space-y-2",
  2: "space-y-4",
  3: "space-y-6",
  4: "space-y-8",
};

const fontSizeMap: Record<string, string> = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
};

const ResumeEditor: React.FC = () => {
  const { confirmDialog, setConfirmDialog } = useBuildStore();

  const hiddenContainerRef = React.useRef<HTMLDivElement>(null);
  const [paginatedSections, setPaginatedSections] = React.useState<
    PaginatedSection[][]
  >([[]]);

  const {
    sections,
    style,
    template = DEFAULT_TEMPLATE,
    sectionSettings = {},
  } = useBuildStore(
    useShallow((state) => ({
      sections: state.sections,
      style: state.style,
      template: state.template,
      sectionSettings: state.sectionSettings,
    })),
  );

  // Pagination Logic
  React.useEffect(() => {
    // Debounce slightly or run immediately?
    // Run immediately inside effect is fine, but we need to make sure the hidden DOM is up to date.
    // The hidden DOM renders 'sections'. When 'sections' changes, React re-renders.
    // This effect runs AFTER render. So hidden DOM should be ready.

    if (!hiddenContainerRef.current) return;

    const measureAndPaginate = () => {
      const container = hiddenContainerRef.current;
      if (!container) return;

      // 1. Get Page Constraints (A4 @ 96DPI approx, or measure)
      // We'll use a fixed MM height reference or standard A4 px
      // A4 is 297mm.
      // Create a temporary element to measure 1mm in pixels to be precise for this screen
      const testDiv = document.createElement("div");
      testDiv.style.height = "297mm";
      testDiv.style.position = "absolute";
      testDiv.style.visibility = "hidden";
      document.body.appendChild(testDiv);
      const pageHeightPx = testDiv.getBoundingClientRect().height || 1122; // Fallback to ~96DPI
      document.body.removeChild(testDiv);

      // 2. Get Vertical Vertical Padding
      // "py-8" is used in the main container -> 2rem top + 2rem bottom
      const rootFontSize =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const verticalPaddingPx = 4 * rootFontSize; // py-8 = 4rem

      // 3. Get Section Spacing
      const spacingLevel = style?.sectionSpacing ?? 2;
      // spacingMap: 1->space-y-2 (0.5rem), 2->space-y-4 (1rem), etc.
      const spacingRem = spacingLevel * 0.5;
      const spacingPx = spacingRem * rootFontSize;

      const items = Array.from(container.children) as HTMLElement[];
      const maxContentHeight = pageHeightPx - verticalPaddingPx;

      const pages: PaginatedSection[][] = [];
      let currentPage: PaginatedSection[] = [];
      let currentPageHeight = 0;

      // Map DOM elements back to sections
      // The hidden container renders sections in order, so index matches 'sections'
      sections.forEach((section, index) => {
        const element = items[index];
        if (!element) return;

        // Check for granular pagination markers
        const headerEl = element.querySelector(
          "[data-pagination-header]",
        ) as HTMLElement;
        const itemEls = Array.from(
          element.querySelectorAll("[data-pagination-item]"),
        ) as HTMLElement[];

        // If it's a granular section (has headers and items marked)
        if (headerEl && itemEls.length > 0) {
          const headerHeight = headerEl.getBoundingClientRect().height;
          // Calculate dynamic spacing between items (if any exist)
          // Distance between bottom of Item 0 and Top of Item 1
          let itemSpacing = 0;
          if (itemEls.length > 1) {
            const r0 = itemEls[0].getBoundingClientRect();
            const r1 = itemEls[1].getBoundingClientRect();
            itemSpacing = r1.top - r0.bottom;
          }

          const itemHeights = itemEls.map(
            (el) => el.getBoundingClientRect().height,
          );
          let currentItemIndex = 0;

          // Consume all items
          while (currentItemIndex < itemHeights.length) {
            // Determine spacing cost for adding a new block to page
            // If page is empty, 0. If not, sectionSpacing.
            const sectionSpacingCost = currentPage.length > 0 ? spacingPx : 0;

            // Scenario A: Starting new section block (Header + [Items])
            // We only do this if we are rendering the header (i.e. start of section)
            // But if we split, we might be in "continuation" mode.
            // Actually, we are just iterating items.
            // If currentItemIndex === 0, we MUST try to fit Header + Item 0.

            if (currentItemIndex === 0) {
              const firstItemHeight = itemHeights[0];
              // Cost to start this section on this page
              const needed =
                sectionSpacingCost + headerHeight + firstItemHeight;

              if (
                currentPageHeight + needed > maxContentHeight &&
                currentPage.length > 0
              ) {
                // Must start on new page
                pages.push(currentPage);
                currentPage = [];
                currentPageHeight = 0;
                continue; // Retry on new page
              }

              // Fits! (or empty page)
              // We start the section here.
              // Add cost
              currentPageHeight += needed;

              // Now greedily consume as many subsequent items as possible
              const itemsForPage = [0];
              currentItemIndex++;

              while (currentItemIndex < itemHeights.length) {
                const nextHeight = itemHeights[currentItemIndex];
                // Cost for next item: ItemHeight + ItemSpacing
                const nextCost = nextHeight + itemSpacing;

                if (currentPageHeight + nextCost <= maxContentHeight) {
                  currentPageHeight += nextCost;
                  itemsForPage.push(currentItemIndex);
                  currentItemIndex++;
                } else {
                  // Full
                  break;
                }
              }

              // Push the block
              currentPage.push({
                ...section,
                hideHeader: false,
                displayItemIndices: itemsForPage,
              });
            } else {
              // Scenario B: Continuation (Items only, No Header)
              // We try to fit the next item.
              const nextHeight = itemHeights[currentItemIndex];
              const needed = sectionSpacingCost + nextHeight; // Section spacing applies because it's a new "Section Block" visually?
              // Wait, if we split a section, the next page starts with Items.
              // Should it have section-spacing from top? "space-y-4" on container handles it.
              // Yes, `renderSection` renders a DIV. The container puts margin-top on it.

              if (
                currentPageHeight + needed > maxContentHeight &&
                currentPage.length > 0
              ) {
                pages.push(currentPage);
                currentPage = [];
                currentPageHeight = 0;
                continue;
              }

              currentPageHeight += needed;
              const itemsForPage = [currentItemIndex];
              currentItemIndex++;

              // Greedily consume more
              while (currentItemIndex < itemHeights.length) {
                const h = itemHeights[currentItemIndex];
                const cost = h + itemSpacing;
                if (currentPageHeight + cost <= maxContentHeight) {
                  currentPageHeight += cost;
                  itemsForPage.push(currentItemIndex);
                  currentItemIndex++;
                } else {
                  break;
                }
              }

              currentPage.push({
                ...section,
                hideHeader: true,
                displayItemIndices: itemsForPage,
              });
            }
          }
        } else {
          // Legacy / Atomic Section logic
          const height = element ? element.getBoundingClientRect().height : 0;

          // Logic: Can we fit this section in the current page?
          // Cost = spacing (if not first) + height
          const isFirstInPage = currentPage.length === 0;
          const spacingCost = isFirstInPage ? 0 : spacingPx;
          const totalAddCost = spacingCost + height;

          if (
            currentPageHeight + totalAddCost > maxContentHeight &&
            currentPage.length > 0
          ) {
            // Push old page
            pages.push(currentPage);

            // Start new page with this section
            currentPage = [section];
            currentPageHeight = height;
          } else {
            // Add to current
            currentPage.push(section);
            currentPageHeight += totalAddCost;
          }
        }
      });

      // Push final page
      if (currentPage.length > 0) {
        pages.push(currentPage);
      } else if (pages.length === 0) {
        // Ensure at least one page exists (empty)
        pages.push([]);
      }

      setPaginatedSections(pages);
    };

    // Observer allows us to re-measure if a section's internal content changes size (e.g. image loads, text wrap)
    const observer = new ResizeObserver(() => {
      measureAndPaginate();
    });

    Array.from(hiddenContainerRef.current.children).forEach((child) => {
      observer.observe(child);
    });

    measureAndPaginate();

    return () => observer.disconnect();
  }, [sections, style]); // Re-run when structure changes

  // Normalize data format for template sections

  // Normalize data format for template sections
  const normalizeData = (sectionType: string, rawData: unknown): unknown => {
    if (!rawData) return rawData;

    // Handle header section (has direct fields like fullName, email, etc.)
    if (sectionType === "header") {
      return rawData;
    }

    const data = rawData as Record<string, unknown>;

    // Handle skills section (expects object with categories or flat array)
    if (sectionType === "skills") {
      if (data.categories !== undefined) {
        return rawData;
      }
      if (data.items !== undefined && Array.isArray(data.items)) {
        // Transform flat items to a default category for templates that expect categories
        return {
          categories: [
            {
              name: "General",
              items: data.items,
            },
          ],
        };
      }
      return rawData;
    }

    // Handle sections with content string (summary, objective)
    if (data.content !== undefined) {
      return data.content;
    }

    // Handle sections with items array (experience, education, projects, etc.)
    if (data.items !== undefined) {
      return data.items;
    }

    return rawData;
  };

  const renderSection = (section: PaginatedSection) => {
    const SectionComponent = getSectionComponent(template, section.type);

    if (SectionComponent) {
      const rawData = section.data;
      const sectionData = normalizeData(section.type, rawData);
      const sectionType = section.type as keyof SectionSettingsMap;
      const settings =
        (sectionSettings as SectionSettingsMap)[sectionType] || {};

      return (
        <SectionComponent
          key={`${section.id}-${(section.displayItemIndices || []).join("-")}`}
          data={sectionData}
          sectionId={section.id}
          sectionType={section.type}
          settings={settings}
          themeColor={style?.primaryColor}
          hideHeader={section.hideHeader}
          displayItemIndices={section.displayItemIndices}
        />
      );
    }

    // Fallback for legacy/unknown section types
    return (
      <GenericSection
        key={section.id}
        section={section}
        themeColor={style?.primaryColor}
      />
    );
  };

  return (
    <div className="flex-1 bg-muted/50 dark:bg-muted/20 min-h-screen pt-20 pb-10 px-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Render each page as a separate A4 container with its specific sections */}
        {paginatedSections.map((pageSections, pageIndex) => (
          <div
            key={pageIndex}
            className={cn(
              "relative bg-white dark:bg-card shadow-2xl rounded-sm mx-auto",
              "min-h-[297mm] w-full max-w-[210mm]", // min-h ensures it looks like a page even if empty
              marginMap[style?.pageMargins ?? 2] || "px-10",
              "py-8",
              fontSizeMap[style?.fontSize ?? "medium"] || "text-base",
            )}
            style={{
              fontFamily: style?.fontFamily || "Inter",
              lineHeight: style?.lineHeight || 1.5,
              // Fixed height for A4 visual
              height: "297mm",
            }}
          >
            {/* Background Pattern */}
            {style?.background !== "plain" && style?.background && (
              <div
                className={cn(
                  "absolute inset-0 pointer-events-none opacity-5",
                  style.background === "dots" &&
                    "bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:20px_20px]",
                  style.background === "lines" &&
                    "bg-[linear-gradient(to_bottom,_#000_1px,_transparent_1px)] bg-[length:100%_20px]",
                  style.background === "grid" &&
                    "bg-[linear-gradient(#000_1px,_transparent_1px),_linear-gradient(90deg,_#000_1px,_transparent_1px)] bg-[length:20px_20px]",
                )}
              />
            )}

            {/* Sections for THIS page only */}
            <div
              className={cn(
                spacingMap[style?.sectionSpacing ?? 2] || "space-y-4",
                "relative",
              )}
            >
              {pageSections.map((section) => renderSection(section))}
            </div>

            {/* Page Number */}
            <div className="absolute bottom-2 right-4 text-[10px] text-muted-foreground">
              Page {pageIndex + 1} of {paginatedSections.length}
            </div>
          </div>
        ))}

        {/* Hidden Measurement Container */}
        {/* This renders OFF-SCREEN but with EXACT widths/styles to enable accurate measurement */}
        <div
          ref={hiddenContainerRef}
          className={cn(
            "absolute top-0 left-0 -z-50 invisible pointer-events-none",
            // Use standard A4 width constraints
            "w-[210mm]",
            // Apply Same Paddings & Fonts
            marginMap[style?.pageMargins ?? 2] || "px-10",
            "py-8",
            fontSizeMap[style?.fontSize ?? "medium"] || "text-base",
            spacingMap[style?.sectionSpacing ?? 2] || "space-y-4",
          )}
          style={{
            fontFamily: style?.fontFamily || "Inter",
            lineHeight: style?.lineHeight || 1.5,
          }}
          aria-hidden="true"
        >
          {sections?.map((section) => (
            // Wrap in div to ensure we measure the full component including internal margins if any
            <div key={section.id} data-section-id={section.id}>
              {renderSection(section)}
            </div>
          ))}
        </div>
      </div>

      {/* Global Confirmation Dialog */}
      <ConfirmDialog
        isOpen={(confirmDialog as ConfirmDialogState)?.isOpen ?? false}
        title={(confirmDialog as ConfirmDialogState)?.title}
        message={(confirmDialog as ConfirmDialogState)?.message}
        onConfirm={() => {
          (confirmDialog as ConfirmDialogState)?.onConfirm?.();
          setConfirmDialog(null);
        }}
        onCancel={() => {
          (confirmDialog as ConfirmDialogState)?.onCancel?.();
          setConfirmDialog(null);
        }}
      />
    </div>
  );
};

export default ResumeEditor;
