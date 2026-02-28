/**
 * Section Types - Discriminated Unions
 * All resume section types with their specific data shapes
 */

// ============================================================================
// Section Type Discriminant
// ============================================================================

export type SectionType =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "awards"
  | "references"
  | "publications"
  | "socialLinks"
  | "strengths"
  | "achievements"
  | "volunteering"
  | "extracurricular" // deprecated — kept for backward compat with persisted data
  | "custom";

// ============================================================================
// Base Types and Item Interfaces
// ============================================================================

/**
 * Base section interface (all sections extend this)
 */
export interface ISectionBase {
  id: string;
  type: SectionType;
  locked?: boolean;
}

/**
 * Base item with ID (for arrays)
 */
export interface IItemBase {
  id: string;
}

// ============================================================================
// Data Item Types (used within sections)
// ============================================================================

export interface IHeaderData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface ISummaryData {
  content: string;
}

export interface IExperienceItem extends IItemBase {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
}

export interface IEducationItem extends IItemBase {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface IProjectItem extends IItemBase {
  name: string;
  subtitle: string;
  date: string;
  description: string;
  bullets: string[];
  link: string;
  githubLink?: string;
  liveLink?: string;
}

export interface ICertificationItem extends IItemBase {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId: string;
}

export interface IVolunteeringItem extends IItemBase {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
}

export interface ILanguageItem extends IItemBase {
  language: string;
  proficiency: string;
}

export interface IAwardItem extends IItemBase {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface IReferenceItem extends IItemBase {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface IPublicationItem extends IItemBase {
  title: string;
  publisher: string;
  date: string;
  link: string;
}

export interface ISocialLinkItem extends IItemBase {
  platform: string;
  url: string;
}

export interface IAchievementItem extends IItemBase {
  title: string;
  description: string;
  date: string;
}

// ============================================================================
// Section Types
// ============================================================================

export interface IHeaderSection extends ISectionBase {
  type: "header";
  data: IHeaderData;
}

export interface ISummarySection extends ISectionBase {
  type: "summary";
  data: ISummaryData;
}

export interface IExperienceSection extends ISectionBase {
  type: "experience";
  data: {
    items: IExperienceItem[];
  };
}

export interface IEducationSection extends ISectionBase {
  type: "education";
  data: {
    items: IEducationItem[];
  };
}

/**
 * Skill category for grouped skills
 */
export interface ISkillCategory {
  name: string;
  items: string[];
  isVisible: boolean;
}

export interface ISkillsSection extends ISectionBase {
  type: "skills";
  data: {
    categories?: ISkillCategory[];
    /**
     * Legacy shape support (pre-categories)
     */
    title?: string;
    items?: string[];
  };
}

export interface IProjectsSection extends ISectionBase {
  type: "projects";
  data: {
    items: IProjectItem[];
  };
}

export interface ICertificationsSection extends ISectionBase {
  type: "certifications";
  data: {
    items: ICertificationItem[];
  };
}

export interface ILanguagesSection extends ISectionBase {
  type: "languages";
  data: {
    items: ILanguageItem[];
  };
}

export interface IAwardsSection extends ISectionBase {
  type: "awards";
  data: {
    items: IAwardItem[];
  };
}

export interface IReferencesSection extends ISectionBase {
  type: "references";
  data: {
    items: IReferenceItem[];
  };
}

export interface IPublicationsSection extends ISectionBase {
  type: "publications";
  data: {
    items: IPublicationItem[];
  };
}

export interface ISocialLinksSection extends ISectionBase {
  type: "socialLinks";
  data: {
    items: ISocialLinkItem[];
  };
}

export interface IStrengthsSection extends ISectionBase {
  type: "strengths";
  data: {
    items: string[];
  };
}

export interface IAchievementsSection extends ISectionBase {
  type: "achievements";
  data: {
    items: IAchievementItem[];
  };
}

export interface ICustomSection extends ISectionBase {
  type: "custom";
  data: {
    title: string;
    content: string;
    items?: string[];
  };
}

export interface IVolunteeringSection extends ISectionBase {
  type: "volunteering";
  data: {
    items: IVolunteeringItem[];
  };
}

// ============================================================================
// Union Type for All Sections
// ============================================================================

/**
 * Discriminated union of all section types
 * Use with type guards for type-safe section handling:
 *
 * @example
 * function renderSection(section: Section) {
 *   switch (section.type) {
 *     case "header": return <Header data={section.data} />;
 *     case "experience": return <Experience items={section.data.items} />;
 *     // ...
 *   }
 * }
 */
export type Section =
  | IHeaderSection
  | ISummarySection
  | IExperienceSection
  | IEducationSection
  | ISkillsSection
  | IProjectsSection
  | ICertificationsSection
  | ILanguagesSection
  | IAwardsSection
  | IReferencesSection
  | IPublicationsSection
  | ISocialLinksSection
  | IStrengthsSection
  | IAchievementsSection
  | IVolunteeringSection
  | ICustomSection;

// ============================================================================
// Section Template (for adding new sections)
// ============================================================================

export interface ISectionStructure {
  type: SectionType;
  label: string;
  icon: string;
  data: Section["data"];
}

export type SectionTemplateMap = Partial<
  Record<SectionType, ISectionStructure>
>;

// ============================================================================
// Backward-Compat Aliases (deprecated — use IVolunteering* instead)
// ============================================================================

/** @deprecated Use IVolunteeringItem */
export type IExtracurricularItem = IVolunteeringItem;
/** @deprecated Use IVolunteeringSection */
export type IExtracurricularSection = IVolunteeringSection;
