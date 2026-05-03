import type { Resume } from "@/types/resume";

export const defaultSectionOrder = [
  "summary",
  "experience",
  "education",
  "skills",
  "certifications",
  "languages",
  "projects",
];

export const defaultResume: Resume = {
  id: crypto.randomUUID(),
  title: "My Resume",
  template: "modern",
  accentColor: "#2563eb",
  font: "sans",
  paperSize: "a4",
  spacing: 1.0,
  sectionOrder: [...defaultSectionOrder],
  photoUrl: undefined,
  personal: {
    fullName: "Alex Morgan",
    title: "Senior Frontend Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://alexmorgan.dev",
    linkedin: "linkedin.com/in/alexmorgan",
  },
  summary:
    "Passionate frontend engineer with 6+ years of experience building scalable web applications. Expert in React, TypeScript, and modern UI frameworks. Led teams to deliver high-impact products serving millions of users.",
  experience: [
    {
      id: crypto.randomUUID(),
      company: "TechCorp Inc.",
      role: "Senior Frontend Engineer",
      startDate: "2021-03",
      endDate: "",
      current: true,
      description: [
        "Led frontend architecture for a SaaS platform serving 2M+ users, improving page load times by 40%.",
        "Migrated legacy codebase from JavaScript to TypeScript, reducing production bugs by 35%.",
        "Mentored a team of 5 engineers and established code review standards and testing practices.",
      ],
    },
    {
      id: crypto.randomUUID(),
      company: "StartupXYZ",
      role: "Frontend Developer",
      startDate: "2018-06",
      endDate: "2021-02",
      current: false,
      description: [
        "Built responsive React dashboards used by 500+ enterprise clients.",
        "Implemented real-time data visualization using D3.js and WebSockets.",
        "Collaborated with UX designers to revamp the product interface, increasing user engagement by 25%.",
      ],
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2014-09",
      endDate: "2018-05",
      gpa: "3.8",
    },
  ],
  skills: [
    {
      id: crypto.randomUUID(),
      category: "Languages",
      skills: ["TypeScript", "JavaScript", "Python", "HTML", "CSS"],
    },
    {
      id: crypto.randomUUID(),
      category: "Frameworks",
      skills: ["React", "Next.js", "Vue.js", "Tailwind CSS", "Node.js"],
    },
    {
      id: crypto.randomUUID(),
      category: "Tools",
      skills: ["Git", "Docker", "Webpack", "Vite", "Figma"],
    },
  ],
  projects: [
    {
      id: crypto.randomUUID(),
      name: "Open Source UI Kit",
      description:
        "A collection of 50+ accessible React components published on npm with 10k+ weekly downloads.",
      link: "https://github.com/alexmorgan/ui-kit",
    },
  ],
  certifications: [
    {
      id: crypto.randomUUID(),
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-06",
      link: "",
    },
  ],
  languages: [
    {
      id: crypto.randomUUID(),
      language: "English",
      proficiency: "Native",
    },
    {
      id: crypto.randomUUID(),
      language: "Spanish",
      proficiency: "Conversational",
    },
  ],
};
