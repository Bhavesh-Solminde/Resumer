import type {
  IAchievementItem,
  ICertificationItem,
  IEducationItem,
  IExperienceItem,
  IExtracurricularItem,
  IHeaderData,
  IProjectItem,
  ISummaryData,
} from "./sections.types.js";

/**
 * Optimized resume section structure (from AI optimization)
 */
export interface IOptimizedResume {
  header: IHeaderData;
  summary: ISummaryData;
  experience: IExperienceItem[];
  education: IEducationItem[];
  projects: IProjectItem[];
  skills: { title: string; items: string[] };
  certifications: ICertificationItem[];
  achievements: IAchievementItem[];
  extracurricular: IExtracurricularItem[];
}
