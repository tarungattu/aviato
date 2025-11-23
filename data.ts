
import { ContentData } from './types';

/**
 * PORTFOLIO CONTENT DATA
 * ----------------------
 * Edit this file to update the content of your website.
 * The application will automatically update to reflect these changes.
 */

export const portfolioData: ContentData = {
  // --- HOME SECTION ---
  hero: {
    title: "Tarun Gattu",
    subtitle: "Software Engineer & Researcher",
    description: "Hi! Welcome to my website, I'm an AI-native engineer with a background in automation, robotics, and full-stack development. I work collaboratively with AI systems—not as shortcuts, but as creative partners that enhance reasoning, design, and innovation.",
    buttonText: "Start Flight"
  },

  // --- SECTION TITLES ---
  // You can rename the headers seen on the top navbar and section tops here
  sectionTitles: {
    experience: "Experience",
    skills: "Technical Skills",
    projects: "Projects",
    contact: "Get In Touch"
  },

  // --- EXPERIENCE SECTION ---
  experience: [
    {
      role: "Algorithm Development and Research Intern",
      company: "Bosch Automotive Electronics India Pvt. Ltd.",
      date: "Jan 2025 - June 2025",
      description: "Developed custom Genetic Algorithm achieving 20× speedup over linear programming. Built Power BI dashboards and contributed to autonomous maintenance concepts. Currently writing research article on scheduling algorithms."
    },
    {
      role: "Undergraduate Researcher",
      company: "Center for Automation and Robotics Research",
      date: "Apr 2024 - Dec 2024",
      description: "Modeled sub-intelligent agents for AMRs, reducing wait time by 40%. Developed fault tolerance mechanisms and worked with ROS2 framework integration with SPADE for decentralized manufacturing environments."
    }
  ],

  // --- SKILLS SECTION ---
  skills: [
    {
      title: "🚀 Languages",
      skills: ["Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "SQL"]
    },
    {
      title: "💾 Databases",
      skills: ["PostgreSQL", "MySQL", "MS SQL", "MongoDB"]
    },
    {
      title: "⚡ Frameworks",
      skills: ["NestJS", "Spring Boot", "React", "Flask", "Express", "TailwindCSS", "ROS2"]
    },
    {
      title: "☁️ Cloud & Tools",
      skills: ["Docker", "Git", "Power BI", "Postman", "Agile/Scrum", "ORM", "AWS"]
    }
  ],

  // --- PROJECTS SECTION ---
  projects: [
    {
      title: "Money Jar",
      description: "A full-stack web application for personal and group money management with JWT authentication, RESTful APIs, and real-time expense settlement capabilities.",
      technologies: ["TypeScript", "NestJS", "PostgreSQL", "JWT", "RESTful APIs"],
      github: "https://github.com/rohitpadaki/money-jar"
    },
    {
      title: "E-commerce Web application",
      description: "Developed an ecommerce application, using Spring Boot serving Restful API, and Reactjs client. The endpoints are secured using Jwt in spring security.",
      technologies: ["Java", "Spring Boot", "React", "PostgreSQL", "JWT"],
      github: "https://github.com/tarungattu/Ecommerce-WebApp",
      demo: "https://youtu.be/LhD9s9dcfuI"
    },
    {
      title: "Warehouse Scheduling Layout Designer",
      description: "Built a full-stack warehouse layout designer and scheduler UI enabling users to design lineless assembly layouts and auto-generate distance matrices.",
      technologies: ["React", "Flask", "Python", "RESTful APIs"],
      github: "https://github.com/tarungattu/SchedulerWebApp",
      demo: "https://youtu.be/FtAjAZHJEBM"
    },
    {
      title: "Job Shop Scheduler with Mobile Robots",
      description: "Python-based scheduling algorithm delivering solutions 300× faster than traditional methods, with integrated simulation pipeline for autonomous mobile robots.",
      technologies: ["Python", "Genetic Algorithm", "Gazebo", "ROS2"],
      github: "https://github.com/tarungattu/JobShopGA_withAMR",
      publication: "https://www.growingscience.com/ijiec/Vol16/IJIEC_2025_3.pdf"
    }
  ],

  // --- CONTACT SECTION ---
  contact: {
    title: "Get In Touch",
    description: "Always open to discussing new opportunities, innovative projects, or just chatting about robotics and AI.",
    email: "tarunrgattu03@gmail.com",
    linkedin: "https://www.linkedin.com/in/tarun-gattu123/",
    github: "https://github.com/tarungattu",
    quote: "\"I work collaboratively with AI systems—not as shortcuts, but as creative partners.\""
  }
};
