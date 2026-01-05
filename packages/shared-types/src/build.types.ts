// /**
//  * Resume Build Types
//  * Types for saved resume builds (MongoDB schema)
//  */

// // ============================================================================
// // Sub-document Types (matching MongoDB schema)
// // ============================================================================

// export interface IEducationDoc {
//   institution: string;
//   degree: string;
//   start: string;
//   end: string;
//   score: string;
// }

// export interface IExperienceDoc {
//   company: string;
//   role: string;
//   start: string;
//   end: string;
//   description: string;
// }

// export interface IProjectDoc {
//   title: string;
//   link: string;
//   start: string;
//   end: string;
//   description: string;
// }

// export interface ICertificationDoc {
//   name: string;
//   issuer: string;
//   date: string;
//   link: string;
// }

// export interface IExtracurricularDoc {
//   title: string;
//   organization: string;
//   date: string;
//   description: string;
// }

// export interface IPersonalInfoDoc {
//   fullName: string;
//   email: string;
//   phone: string;
//   linkedin: string;
//   github: string;
//   website: string;
//   summary: string;
// }

// export interface ISkillsDoc {
//   languages: string[];
//   frameworks: string[];
//   tools: string[];
// }

// // ============================================================================
// // Resume Build Content
// // ============================================================================

// export interface IResumeBuildContent {
//   personalInfo: IPersonalInfoDoc;
//   education: IEducationDoc[];
//   experience: IExperienceDoc[];
//   projects: IProjectDoc[];
//   certifications: ICertificationDoc[];
//   extracurricular: IExtracurricularDoc[];
//   skills: ISkillsDoc;
// }

// // ============================================================================
// // Resume Build Layout
// // ============================================================================

// export interface IResumeBuildLayout {
//   sectionOrder: string[];
// }

// // ============================================================================
// // Resume Build (Full Document)
// // ============================================================================

// export interface IResumeBuild {
//   _id: string;
//   userId: string;
//   title: string;
//   templateId: string;
//   thumbnail: string;
//   content: IResumeBuildContent;
//   layout: IResumeBuildLayout;
//   /**
//    * TODO: Implement "Create Resume from Scan" feature
//    * - Link resume to the analyzed/uploaded resume scan
//    * - Pre-populate content from AI analysis results
//    */
//   sourceScanId: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// /**
//  * Resume build for list/dashboard (lightweight)
//  */
// export interface IResumeBuildSummary {
//   _id: string;
//   title: string;
//   templateId: string;
//   thumbnail: string;
//   updatedAt: string;
// }

// /**
//  * Create/Update resume build request
//  */
// export interface ICreateResumeBuildRequest {
//   title?: string;
//   templateId?: string;
//   content: IResumeBuildContent;
//   layout?: IResumeBuildLayout;
//   sourceScanId?: string;
// }

// export interface IUpdateResumeBuildRequest {
//   title?: string;
//   templateId?: string;
//   thumbnail?: string;
//   content?: Partial<IResumeBuildContent>;
//   layout?: IResumeBuildLayout;
// }
