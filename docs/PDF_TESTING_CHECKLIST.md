# �� PDF vs Builder UI Testing Checklist

## 1) Overview

This checklist validates recent **PDF vs Builder UI consistency fixes** across resume templates.

### What was fixed
- Section header styling consistency (background removal, font sizing, borders)
- Bullet spacing and line-height readability
- Skill item/badge visual treatment
- Typography, date formatting, and color parity
- Template-specific visual alignment between Builder preview and generated PDF

### Why this testing matters
- Ensures the generated PDF is a **trustworthy, pixel-close export** of what users design in Builder.
- Prevents formatting regressions that impact readability and professional presentation.
- Confirms all templates behave consistently for real-world resume content.

---

## 2) Pre-Testing Setup

### ✅ Create a complete test resume (all sections populated)
Use one test resume that includes realistic data in every section:
- Header/Profile
- Summary
- Experience
- Education
- Skills
- Projects
- Achievements
- Certifications
- Volunteering

> 🔍 Tip: Keep one "baseline" resume and duplicate it per template to reduce setup variability.

### Recommended test data by section

- **Header/Profile**
  - Full name (long enough to test wrapping)
  - Job title
  - Phone, email, LinkedIn, portfolio/GitHub links
  - Location

- **Summary**
  - 2–4 lines with punctuation and mixed sentence lengths

- **Experience**
  - 2–3 roles
  - One role with long title + long company name
  - 3–5 bullets per role
  - At least one role missing explicit position (to test fallback logic)
  - Include ongoing role date format (e.g., `Jan 2022 - Present`)

- **Education**
  - 2 entries (degree + institution + date)
  - One entry with honors or extra detail in description

- **Skills**
  - Grouped categories (e.g., Languages, Frameworks, Tools)
  - Long comma-separated lists to test wrapping/overflow

- **Projects**
  - 2–3 projects with
    - Title
    - Technologies (for ` • ` separator validation)
    - Link
    - Multi-line description

- **Achievements**
  - 3+ entries using `Title - Description` style

- **Certifications**
  - 2+ entries with issuer, date, and link

- **Volunteering**
  - At least 1 entry with role, organization, date, and bullets

---

## 3) Visual Comparison Checklist (Template × Section)

### Instructions
For each row:
1. Open Builder preview and generated PDF side-by-side.
2. Compare the same section in the same template.
3. Check all items below for that row.

**Row-level checks:**
- [ ] Section header has NO background color
- [ ] Section header font size matches
- [ ] Section header has bottom border (correct color)
- [ ] Bullet spacing looks natural (not compressed)
- [ ] Line height in bullets is readable
- [ ] Skill badges have transparent backgrounds
- [ ] Font sizes match across titles/subtitles
- [ ] Dates are formatted identically
- [ ] Colors match (especially theme color)
- [ ] Overall spacing/padding is identical

| Template | Section | Complete all 10 checks above |
|---|---|---|
| Shraddha | Experience | [ ] |
| Shraddha | Education | [ ] |
| Shraddha | Skills | [ ] |
| Shraddha | Projects | [ ] |
| Shraddha | Achievements | [ ] |
| Shraddha | Certifications | [ ] |
| Shraddha | Volunteering | [ ] |
| Basic | Experience | [ ] |
| Basic | Education | [ ] |
| Basic | Skills | [ ] |
| Basic | Projects | [ ] |
| Basic | Achievements | [ ] |
| Basic | Certifications | [ ] |
| Basic | Volunteering | [ ] |
| Modern | Experience | [ ] |
| Modern | Education | [ ] |
| Modern | Skills | [ ] |
| Modern | Projects | [ ] |
| Modern | Achievements | [ ] |
| Modern | Certifications | [ ] |
| Modern | Volunteering | [ ] |

---

## 4) Section-Specific Tests

### Experience / Education
- [ ] Title and company/institution appear on the same line
- [ ] Dates are right-aligned
- [ ] Bullet points render under description correctly
- [ ] Position fallback logic works when role/title is missing

### Skills
- [ ] Skills display in comma-separated format
- [ ] No background on skill items
- [ ] Categories render correctly when grouped

### Projects
- [ ] Technology list uses ` • ` separator
- [ ] Links are styled consistently with template rules
- [ ] Descriptions wrap properly without overlap/clipping

### Achievements
- [ ] Entries use `Title - Description` format
- [ ] Bullet spacing is consistent with other list sections

### Certifications
- [ ] Issuer is displayed inline with title/metadata
- [ ] Date formatting matches Builder
- [ ] Links are clickable and styled correctly in PDF

### Volunteering
- [ ] Layout matches Experience pattern
- [ ] Role and organization are clearly distinguishable

---

## 5) Template-Specific Tests

### Shraddha
- [ ] Blue scheme is correct (`#3b82f6`)
- [ ] No backgrounds on section headers
- [ ] Clean, minimal visual style is preserved

### Basic
- [ ] Teal scheme is correct (`#0d9488`)
- [ ] Header is center-aligned
- [ ] Underlines are simple and consistent

### Modern
- [ ] Indigo scheme is correct (`#4f46e5`)
- [ ] Accent line before section headers appears correctly
- [ ] Left border on header renders consistently

---

## 6) Edge Cases to Test

- [ ] Very long text wraps naturally (no clipping/overlap)
- [ ] Empty sections render cleanly (no broken gaps/artifacts)
- [ ] Many skills handled correctly (line wraps/overflow behavior)
- [ ] Multi-page resumes keep proper page breaks
- [ ] Custom theme colors propagate identically to PDF
- [ ] Special characters (e.g., `&`, `/`, `•`, accented letters) render correctly

---

## 7) Acceptance Criteria ("Pixel-Perfect Match")

A section/template comparison is considered acceptable only if all conditions are met:

- ✅ **Alignment tolerance:** `< 5px`
- ✅ **Color matching:** exact hex value match
- ✅ **Font sizing:** within `1pt`
- ✅ **Spacing:** within `2px`

> ❌ If any threshold is exceeded, log an issue in the reporting format below.

---

## 8) Reporting Issues

Use this template for every discrepancy found:

```md
## ❌ PDF/UI Mismatch Report
- Section: <section name>
- Template: <Shraddha | Basic | Modern>
- Expected: <Builder screenshot link or attachment>
- Actual: <PDF screenshot link or attachment>
- Description: <clear explanation of visual difference>
- Severity: <Low | Medium | High>
- Repro Steps:
  1. ...
  2. ...
  3. ...
```

---

## Final Sign-off

- [ ] All checklist rows completed
- [ ] All edge cases validated
- [ ] Any failures logged with screenshots
- [ ] Fixes re-tested after changes
- [ ] Ready for release ✅

