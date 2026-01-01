/**
 * Template Registry
 * Central registration point for all resume templates
 * Each template provides its own section components
 */

import React from "react";

// Template imports
import shraddhaTemplate from "./shraddha";
import basicTemplate from "./basic";
import modernTemplate from "./modern";

// Re-export ConfirmDialog for convenience
export { default as ConfirmDialog } from "../shared/ConfirmDialog";

// Types
export interface SectionData {
  [key: string]: unknown;
}

export interface TemplateSection {
  data: SectionData;
  sectionId: string;
  settings?: Record<string, boolean>;
}

export interface TemplateSectionComponent extends React.FC<TemplateSection> {}

export interface Template {
  id: string;
  name: string;
  description: string;
  themeColor: string;
  fontFamily: string;
  preview: React.FC;
  sections: Record<string, TemplateSectionComponent>;
  sampleData: Record<string, unknown>;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  preview?: React.FC;
  themeColor: string;
  fontFamily?: string;
  sections?: string[];
}

// Template registry map
const templates: Record<string, Template> = {
  shraddha: shraddhaTemplate as Template,
  basic: basicTemplate as Template,
  modern: modernTemplate as Template,
};

// Default template
export const DEFAULT_TEMPLATE = "shraddha";

/**
 * Get template configuration by ID
 */
export function getTemplate(templateId: string): Template {
  return templates[templateId] || templates[DEFAULT_TEMPLATE];
}

/**
 * Get section component for a specific template and section type
 */
export function getSectionComponent(
  templateId: string,
  sectionType: string
): TemplateSectionComponent | null {
  const template = getTemplate(templateId);
  return template.sections[sectionType] || null;
}

/**
 * Get all available templates with metadata
 */
export function getAllTemplates(): TemplateMetadata[] {
  return Object.entries(templates).map(([id, template]) => ({
    id,
    name: template.name,
    description: template.description,
    preview: template.preview,
    themeColor: template.themeColor,
  }));
}

/**
 * Get template metadata by ID
 */
export function getTemplateMetadata(templateId: string): TemplateMetadata {
  const template = getTemplate(templateId);
  return {
    id: templateId,
    name: template.name,
    description: template.description,
    themeColor: template.themeColor,
    fontFamily: template.fontFamily,
    sections: Object.keys(template.sections),
  };
}

/**
 * Check if a template supports a specific section type
 */
export function templateSupportsSection(
  templateId: string,
  sectionType: string
): boolean {
  const template = getTemplate(templateId);
  return sectionType in template.sections;
}

/**
 * Get sample data for a template
 */
export function getTemplateSampleData(
  templateId: string
): Record<string, unknown> {
  const template = getTemplate(templateId);
  return template.sampleData || {};
}

export default templates;
