/**
 * Sample data for Modern template
 */

interface DateValue {
  month: number;
  year: number;
}

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: DateValue;
  endDate: DateValue | "Present";
  bullets: string[];
}

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: DateValue;
  endDate: DateValue;
  gpa: string;
}

interface SkillCategory {
  name: string;
  items: string[];
}

interface SkillsData {
  categories: SkillCategory[];
}

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  bullets: string[];
}

interface SectionRef {
  id: string;
  type: string;
  order: number;
}

interface HeaderData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

interface SectionSettings {
  showGPA?: boolean;
  showLocation?: boolean;
  showPeriod?: boolean;
  showBullets?: boolean;
  showCompany?: boolean;
}

export interface SampleData {
  template: string;
  themeColor: string;
  sections: SectionRef[];
  header: HeaderData;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillsData;
  projects: ProjectItem[];
  sectionSettings: Record<string, SectionSettings>;
}

export const sampleData: SampleData = {
  template: "modern",
  themeColor: "#6366f1",
  sections: [
    { id: "header", type: "header", order: 0 },
    { id: "summary", type: "summary", order: 1 },
    { id: "experience", type: "experience", order: 2 },
    { id: "education", type: "education", order: 3 },
    { id: "skills", type: "skills", order: 4 },
    { id: "projects", type: "projects", order: 5 },
  ],

  header: {
    name: "Alex Johnson",
    title: "Full Stack Developer",
    email: "alex.johnson@email.com",
    phone: "+1 (415) 555-0123",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
    website: "alexjohnson.dev",
  },

  summary:
    "Creative and detail-oriented full stack developer with 5+ years of experience building modern web applications. Passionate about clean code, user experience, and emerging technologies.",

  experience: [
    {
      id: "exp-1",
      company: "Innovation Labs",
      position: "Senior Developer",
      location: "San Francisco, CA",
      startDate: { month: 3, year: 2021 },
      endDate: "Present",
      bullets: [
        "Lead development of customer-facing applications using React and GraphQL",
        "Architected microservices infrastructure handling 1M+ daily requests",
        "Implemented CI/CD pipelines reducing deployment time by 60%",
      ],
    },
    {
      id: "exp-2",
      company: "Digital Agency Co",
      position: "Full Stack Developer",
      location: "Oakland, CA",
      startDate: { month: 6, year: 2018 },
      endDate: { month: 2, year: 2021 },
      bullets: [
        "Developed 20+ client websites using React, Next.js, and Node.js",
        "Built custom CMS solutions for content management",
        "Mentored junior developers in best practices",
      ],
    },
  ],

  education: [
    {
      id: "edu-1",
      institution: "UC Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Berkeley, CA",
      startDate: { month: 8, year: 2014 },
      endDate: { month: 5, year: 2018 },
      gpa: "3.8/4.0",
    },
  ],

  skills: {
    categories: [
      {
        name: "Frontend",
        items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL"],
      },
      {
        name: "Backend",
        items: ["Node.js", "Python", "PostgreSQL", "Redis", "Docker"],
      },
      {
        name: "Tools",
        items: ["Git", "AWS", "Kubernetes", "Figma", "Jira"],
      },
    ],
  },

  projects: [
    {
      id: "proj-1",
      name: "DevFlow",
      description: "Open source developer workflow automation tool",
      technologies: ["TypeScript", "React", "Electron", "Node.js"],
      link: "github.com/alexjohnson/devflow",
      bullets: [
        "Created desktop app with 5K+ GitHub stars",
        "Built plugin system for extensibility",
      ],
    },
  ],

  sectionSettings: {
    education: {
      showGPA: true,
      showLocation: true,
      showPeriod: true,
      showBullets: false,
    },
    experience: {
      showCompany: true,
      showLocation: true,
      showPeriod: true,
      showBullets: true,
    },
  },
};
