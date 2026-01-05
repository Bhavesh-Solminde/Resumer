# Changelog

All notable changes to `@resumer/shared-types` will be documented in this file.

## Versioning Policy

- **Patch (0.0.x)**: Additive changes (new types, new optional fields)
- **Minor (0.x.0)**: Breaking changes (renamed/removed types, changed required fields)
- **Major (x.0.0)**: Major architectural changes

## [0.1.0] - 2026-01-05

### Breaking Changes

- **Renamed `ITheme` to `IStyle`**: This is a breaking change. Consumers should update references to `IStyle`.
- **Renamed `ISectionTemplate` to `ISectionStructure`**: This is a breaking change.
- **Removed Types**: `IResumeScan`, `IAnalysisScan`, and `IOptimizationScan` were removed/commented out from the public API.

## [0.0.0] - 2024-12-31

### Added

- Initial type definitions
- `ISectionBase` and discriminated union section types
- `IUser`, `IResumeScan`, `IResumeBuild` interfaces
- `ApiResponse<T>` generic wrapper
- `IAnalysisResult`, `IOptimizationResult` AI response types
- `IStyle`, `IResumeData`, `ISectionSettings` resume types
