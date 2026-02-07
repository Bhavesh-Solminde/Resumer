// ============================================================================
// Shared ATS Score Calculation Engine
// Used by both analyze and optimize controllers for consistent scoring
// ============================================================================

/**
 * Quality metrics extracted by Gemini (used for internal score calculation)
 */
export interface IQualityMetrics {
  is_contact_info_complete: boolean;
  bullet_points_count: number;
  quantified_bullet_points_count: number;
  action_verbs_used: string[];
  weak_words_found: string[];
  spelling_errors: string[];
  missing_sections: string[];
}

/** Strong action verbs that improve ATS scores */
export const STRONG_ACTION_VERBS = new Set([
  "achieved", "accelerated", "accomplished", "administered", "analyzed",
  "architected", "automated", "boosted", "built", "collaborated",
  "consolidated", "created", "decreased", "delivered", "designed",
  "developed", "devised", "directed", "drove", "eliminated",
  "engineered", "enhanced", "established", "exceeded", "executed",
  "expanded", "expedited", "facilitated", "formulated", "generated",
  "grew", "headed", "implemented", "improved", "increased",
  "initiated", "innovated", "integrated", "introduced", "launched",
  "led", "leveraged", "maintained", "managed", "maximized",
  "mentored", "migrated", "minimized", "modernized", "negotiated",
  "optimized", "orchestrated", "organized", "overhauled", "oversaw",
  "pioneered", "planned", "produced", "programmed", "proposed",
  "redesigned", "reduced", "refactored", "reformed", "remodeled",
  "replaced", "resolved", "restructured", "revamped", "saved",
  "scaled", "secured", "simplified", "spearheaded", "standardized",
  "streamlined", "strengthened", "supervised", "surpassed", "trained",
  "transformed", "upgraded", "utilized",
]);

/**
 * Calculate ATS score based on quality metrics
 * @param metrics - Quality metrics from Gemini analysis
 * @returns Calculated ATS score (0-100)
 */
export function calculateATSScore(metrics: IQualityMetrics): number {
  // Defensive: normalize AI-generated fields to prevent crashes from malformed output
  const m: IQualityMetrics = {
    is_contact_info_complete: !!metrics.is_contact_info_complete,
    bullet_points_count: metrics.bullet_points_count ?? 0,
    quantified_bullet_points_count: metrics.quantified_bullet_points_count ?? 0,
    action_verbs_used: Array.isArray(metrics.action_verbs_used) ? metrics.action_verbs_used : [],
    weak_words_found: Array.isArray(metrics.weak_words_found) ? metrics.weak_words_found : [],
    spelling_errors: Array.isArray(metrics.spelling_errors) ? metrics.spelling_errors : [],
    missing_sections: Array.isArray(metrics.missing_sections) ? metrics.missing_sections : [],
  };

  let score = 0;

  // 1. Contact Information (15 points)
  if (m.is_contact_info_complete) {
    score += 15;
  } else {
    score += 5;
  }

  // 2. Bullet Points Quantity (15 points)
  const bulletCount = m.bullet_points_count;
  if (bulletCount >= 15 && bulletCount <= 30) {
    score += 15;
  } else if (bulletCount >= 10 && bulletCount < 15) {
    score += 12;
  } else if (bulletCount >= 5 && bulletCount < 10) {
    score += 8;
  } else if (bulletCount > 0) {
    score += 4;
  }

  // 3. Quantified Achievements (20 points)
  const quantifiedCount = m.quantified_bullet_points_count;
  const quantifiedRatio = bulletCount > 0 ? quantifiedCount / bulletCount : 0;
  if (quantifiedRatio >= 0.5) {
    score += 20;
  } else if (quantifiedRatio >= 0.3) {
    score += 15;
  } else if (quantifiedRatio >= 0.15) {
    score += 10;
  } else if (quantifiedCount > 0) {
    score += 5;
  }

  // 4. Action Verbs Usage (15 points)
  const actionVerbCount = m.action_verbs_used.filter((verb) =>
    STRONG_ACTION_VERBS.has(verb.toLowerCase())
  ).length;
  if (actionVerbCount >= 10) {
    score += 15;
  } else if (actionVerbCount >= 6) {
    score += 12;
  } else if (actionVerbCount >= 3) {
    score += 8;
  } else if (actionVerbCount > 0) {
    score += 4;
  }

  // 5. Weak Words Penalty (10 points max)
  const weakWordsCount = m.weak_words_found.length;
  if (weakWordsCount === 0) {
    score += 10;
  } else if (weakWordsCount <= 2) {
    score += 6;
  } else if (weakWordsCount <= 5) {
    score += 2;
  }

  // 6. Spelling/Grammar (10 points)
  const spellingErrors = m.spelling_errors.length;
  if (spellingErrors === 0) {
    score += 10;
  } else if (spellingErrors <= 2) {
    score += 6;
  } else if (spellingErrors <= 5) {
    score += 3;
  }

  // 7. Section Completeness (15 points)
  const missingSections = m.missing_sections.length;
  if (missingSections === 0) {
    score += 15;
  } else if (missingSections === 1) {
    score += 10;
  } else if (missingSections === 2) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Generate formatting issues from quality metrics
 */
export function generateFormattingIssues(metrics: IQualityMetrics): string[] {
  const issues: string[] = [];

  if (!metrics.is_contact_info_complete) {
    issues.push("Missing essential contact information (email, phone, or location)");
  }

  if (metrics.bullet_points_count < 10) {
    issues.push("Resume has too few bullet points - aim for 15-25 achievement bullets");
  }

  const quantifiedRatio =
    metrics.bullet_points_count > 0
      ? metrics.quantified_bullet_points_count / metrics.bullet_points_count
      : 0;
  if (quantifiedRatio < 0.3) {
    issues.push("Less than 30% of bullets contain quantified metrics - add more numbers and percentages");
  }

  if (metrics.weak_words_found.length > 0) {
    issues.push(`Found weak words: ${metrics.weak_words_found.slice(0, 5).join(", ")}`);
  }

  if (metrics.spelling_errors.length > 0) {
    issues.push(`Potential spelling issues: ${metrics.spelling_errors.slice(0, 3).join(", ")}`);
  }

  if (metrics.missing_sections.length > 0) {
    issues.push(`Missing standard sections: ${metrics.missing_sections.join(", ")}`);
  }

  return issues;
}
