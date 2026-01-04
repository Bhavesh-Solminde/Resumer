/**
 * @resumer/shared-types
 * Shared TypeScript types for the Resumer monorepo
 *
 * @packageDocumentation
 */

// API Types
export type {
  ApiResponse,
  IAnalysisResult,
  IOptimizationResult,
  IComparisonItem,
  IPaginationMeta,
  PaginatedResponse,
  IErrorResponse,
} from "./api.types.js";

// User Types
export type {
  IUser,
  IUserWithPassword,
  IUserMethods,
  ISignupRequest,
  ILoginRequest,
  IAuthResponse,
  IUpdatePasswordRequest,
  IUpdateProfileRequest,
  IJwtPayload,
} from "./user.types.js";

// Scan Types
export type {
  ResumeScanType,
  IResumeScan,
  IAnalysisScan,
  IOptimizationScan,
  IResumeScanSummary,
  ICreateScanRequest,
  IOptimizeRequest,
} from "./scan.types.js";

// Section Types
export type {
  SectionType,
  ISectionBase,
  IItemBase,
  IHeaderData,
  ISummaryData,
  IExperienceItem,
  IEducationItem,
  IProjectItem,
  ICertificationItem,
  ILanguageItem,
  IAwardItem,
  IReferenceItem,
  IPublicationItem,
  ISocialLinkItem,
  IAchievementItem,
  IHeaderSection,
  ISummarySection,
  IExperienceSection,
  IEducationSection,
  ISkillsSection,
  IProjectsSection,
  ICertificationsSection,
  ILanguagesSection,
  IAwardsSection,
  IReferencesSection,
  IPublicationsSection,
  ISocialLinksSection,
  IStrengthsSection,
  IAchievementsSection,
  ICustomSection,
  Section,
  ISectionTemplate,
  SectionTemplateMap,
} from "./sections.types.js";

// Resume Types
export type {
  FontSize,
  BackgroundPattern,
  ITheme,
  ISectionSettings,
  SectionSettingsMap,
  TemplateId,
  LayoutType,
  HeaderStyle,
  ITemplateConfig,
  TemplateConfigMap,
  IResumeData,
  IConfirmDialog,
  PanelId,
  IActivePanels,
  IResumeDataState,
  IThemeState,
  ITemplatesState,
  IUIState,
  IBuildState,
} from "./resume.types.js";

export { DEFAULT_THEME } from "./resume.types.js";

// Build Types (MongoDB schema)
export type {
  IEducationDoc,
  IExperienceDoc,
  IProjectDoc,
  ICertificationDoc,
  IExtracurricularDoc,
  IPersonalInfoDoc,
  ISkillsDoc,
  IResumeBuildContent,
  IResumeBuildLayout,
  IResumeBuild,
  IResumeBuildSummary,
  ICreateResumeBuildRequest,
  IUpdateResumeBuildRequest,
} from "./build.types.js";
