
export type SectionId = 'home' | 'experience' | 'skills' | 'projects' | 'contact';
export type WeatherType = 'day' | 'sunset' | 'midnight' | 'rainy' | 'sakura';

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  github?: string; // Optional: URL to code repository
  demo?: string;   // Optional: URL to live demo or video
  publication?: string; // Optional: URL to research paper
}

export interface Experience {
  role: string;
  company: string;
  date: string;
  description: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ContentData {
  // Text for the Home screen
  hero: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string; // e.g. "Start Flight"
  };
  // Titles for the specific sections (e.g. "My Work", "History")
  sectionTitles: {
    experience: string;
    skills: string;
    projects: string;
    contact: string;
  };
  experience: Experience[];
  skills: SkillCategory[];
  projects: Project[];
  contact: {
    title: string;
    description: string; // The paragraph below the title
    email: string;
    linkedin: string;
    github: string;
    quote: string; // The italicized quote at the bottom
  };
}