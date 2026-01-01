/**
 * Sample data for Basic template
 */

interface DateValue {
  month: number;
  year: number;
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
  bullets: string[];
}

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: DateValue;
  endDate: string;
  bullets: string[];
}

interface SkillCategory {
  name: string;
  items: string[];
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
}

interface SampleData {
  template: string;
  themeColor: string;
  sections: SectionRef[];
  header: HeaderData;
  objective: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: {
    categories: SkillCategory[];
  };
}

export const sampleData: SampleData = {
  template: "basic",
  themeColor: "#0d9488",
  sections: [
    { id: "header", type: "header", order: 0 },
    { id: "objective", type: "objective", order: 1 },
    { id: "education", type: "education", order: 2 },
    { id: "experience", type: "experience", order: 3 },
    { id: "skills", type: "skills", order: 4 },
  ],

  header: {
    name: "John Smith",
    title: "Software Developer",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    linkedin: "linkedin.com/in/johnsmith",
    github: "github.com/johnsmith",
  },

  objective:
    "Motivated software developer seeking opportunities to contribute to innovative projects while growing technical expertise in full-stack development.",

  education: [
    {
      id: "edu-1",
      institution: "State University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "New York, NY",
      startDate: { month: 8, year: 2018 },
      endDate: { month: 5, year: 2022 },
      gpa: "3.7/4.0",
      bullets: [],
    },
  ],

  experience: [
    {
      id: "exp-1",
      company: "Tech Corp",
      position: "Junior Developer",
      location: "New York, NY",
      startDate: { month: 6, year: 2022 },
      endDate: "Present",
      bullets: [
        "Developed and maintained web applications using React and Node.js",
        "Collaborated with team members on code reviews and testing",
        "Participated in agile development processes",
      ],
    },
  ],

  skills: {
    categories: [
      {
        name: "Languages",
        items: ["JavaScript", "TypeScript", "Python", "HTML/CSS"],
      },
      {
        name: "Frameworks",
        items: ["React", "Node.js", "Express", "Next.js"],
      },
      {
        name: "Tools",
        items: ["Git", "Docker", "VS Code", "Figma"],
      },
    ],
  },
};
