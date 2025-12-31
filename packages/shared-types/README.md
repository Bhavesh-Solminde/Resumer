# @resumer/shared-types

Shared TypeScript type definitions for the Resumer monorepo.

## Installation

This package is internal to the monorepo. It's automatically linked via pnpm workspaces.

```bash
# In frontend or backend package.json
"dependencies": {
  "@resumer/shared-types": "workspace:*"
}
```

## Usage

```typescript
import {
  IUser,
  ApiResponse,
  IResumeData,
  Section,
} from "@resumer/shared-types";

// Use discriminated unions for type-safe section handling
function renderSection(section: Section) {
  switch (section.type) {
    case "header":
      return <HeaderSection data={section.data} />;
    case "experience":
      return <ExperienceSection data={section.data} />;
    // TypeScript knows the exact shape of section.data!
  }
}
```

## Versioning

See [CHANGELOG.md](./CHANGELOG.md) for version history and policy.

- Bump **patch** for additive changes
- Bump **minor** for breaking changes
