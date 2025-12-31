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
  | "volunteering"
  | "awards"
  | "interests"
  | "references"
  | "publications"
  | "courses"
  | "socialLinks"
  | "strengths"
  | "objective"
  | "achievements"
  | "personalDetails"
  | "technicalSkills"
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
}

export interface ICertificationItem extends IItemBase {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
}

export interface ILanguageItem extends IItemBase {
  language: string;
  proficiency: string;
}

export interface IVolunteeringItem extends IItemBase {
  role: string;
  organization: string;
  date: string;
  description: string;
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

export interface ICourseItem extends IItemBase {
  name: string;
  provider: string;
  date: string;
}

export interface ISocialLinkItem extends IItemBase {
  platform: string;
  url: string;
}

export interface IAchievementItem extends IItemBase {
  description: string;
}

export interface ITechnicalSkillCategory extends IItemBase {
  name: string;
  skills: string;
}

export interface IPersonalDetailsData {
  dob: string;
  languages: string;
  hobbies: string;
  address: string;
}

export interface IObjectiveData {
  content: string;
}

export interface ICustomSectionData {
  title: string;
  content: string;
}

// ============================================================================
// Discriminated Union Section Types
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

export interface ISkillsSection extends ISectionBase {
  type: "skills";
  data: {
    title: string;
    items: string[];
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

export interface IVolunteeringSection extends ISectionBase {
  type: "volunteering";
  data: {
    items: IVolunteeringItem[];
  };
}

export interface IAwardsSection extends ISectionBase {
  type: "awards";
  data: {
    items: IAwardItem[];
  };
}

export interface IInterestsSection extends ISectionBase {
  type: "interests";
  data: {
    items: string[];
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

export interface ICoursesSection extends ISectionBase {
  type: "courses";
  data: {
    items: ICourseItem[];
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

export interface IObjectiveSection extends ISectionBase {
  type: "objective";
  data: IObjectiveData;
}

export interface IAchievementsSection extends ISectionBase {
  type: "achievements";
  data: {
    items: IAchievementItem[];
  };
}

export interface IPersonalDetailsSection extends ISectionBase {
  type: "personalDetails";
  data: IPersonalDetailsData;
}

export interface ITechnicalSkillsSection extends ISectionBase {
  type: "technicalSkills";
  data: {
    categories: ITechnicalSkillCategory[];
  };
}

export interface ICustomSection extends ISectionBase {
  type: "custom";
  data: ICustomSectionData;
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
 *     case 'header':
 *       // TypeScript knows section.data is IHeaderData
 *       return <Header name={section.data.fullName} />;
 *     case 'experience':
 *       // TypeScript knows section.data.items is IExperienceItem[]
 *       return <Experience items={section.data.items} />;
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
  | IVolunteeringSection
  | IAwardsSection
  | IInterestsSection
  | IReferencesSection
  | IPublicationsSection
  | ICoursesSection
  | ISocialLinksSection
  | IStrengthsSection
  | IObjectiveSection
  | IAchievementsSection
  | IPersonalDetailsSection
  | ITechnicalSkillsSection
  | ICustomSection;

// ============================================================================
// Section Template (for adding new sections)
// ============================================================================

export interface ISectionTemplate {
  type: SectionType;
  label: string;
  icon: string;
  data: Section["data"];
}

export type SectionTemplateMap = Partial<Record<SectionType, ISectionTemplate>>;
