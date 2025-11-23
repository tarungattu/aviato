
import React, { useState, useRef, useEffect } from 'react';
import { SectionId } from '../types';
import { portfolioData } from '../data';
import { Linkedin, Mail, Github } from 'lucide-react';
import ProjectCard from './ProjectCard';

interface OverlayProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  isMobile: boolean;
  onStartFlight: () => void;
  hasStarted: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ activeSection, onNavigate, isMobile, onStartFlight, hasStarted }) => {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fade out header on scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    // Start fading immediately, fully transparent by 100px scroll
    const newOpacity = Math.max(0, 1 - scrollTop / 150);
    setScrollOpacity(newOpacity);
  };

  // Reset opacity when changing sections
  useEffect(() => {
    setScrollOpacity(1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeSection]);
  
  const panelClass = `
    absolute top-0 right-0 h-full w-full md:w-1/2 lg:w-5/12 
    bg-bgSecondary/90 backdrop-blur-xl border-l border-primary/10 
    text-gray-100 px-8 pb-8 overflow-y-auto custom-scroll 
    transition-transform duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1)
    ${activeSection === 'home' && !isMobile ? 'translate-x-full' : 'translate-x-0'}
    z-10 flex flex-col
    pt-32
  `;

  const NavBtn = ({ id, label }: { id: SectionId; label: string }) => (
    <button
      onClick={() => onNavigate(id)}
      className={`
        px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
        ${activeSection === id 
          ? 'bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
          : 'bg-bgSecondary/50 text-gray-400 hover:text-white hover:bg-bgSecondary'}
      `}
      aria-current={activeSection === id ? 'page' : undefined}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-bgPrimary/90 to-transparent pointer-events-none">
        <div className="text-2xl font-bold text-primary pointer-events-auto cursor-pointer drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" onClick={() => onNavigate('home')}>
          TG
        </div>
        <div className="flex gap-2 pointer-events-auto flex-wrap justify-end">
          <NavBtn id="home" label="Home" />
          <NavBtn id="experience" label="Exp" />
          <NavBtn id="skills" label="Skills" />
          <NavBtn id="projects" label="Work" />
          <NavBtn id="contact" label="Contact" />
        </div>
      </nav>

      {/* Main Home Hero */}
      <div 
        className={`absolute top-1/2 left-4 md:left-24 transform -translate-y-1/2 z-0 transition-opacity duration-700 ease-in-out pointer-events-none
        ${activeSection === 'home' ? 'opacity-100 delay-300' : 'opacity-0'}`}
      >
        <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary mb-4 drop-shadow-lg">
          {portfolioData.hero.title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl drop-shadow-md bg-bgPrimary/30 backdrop-blur-sm p-4 rounded-lg border-l-4 border-primary">
          {portfolioData.hero.subtitle}
        </p>
        
        <div className="mt-8 flex gap-4 pointer-events-auto">
           {/* Start Flight Button */}
           <button 
             onClick={onStartFlight} 
             className="group relative px-8 py-4 bg-primary rounded-full font-bold text-white shadow-lg hover:shadow-primary/50 overflow-hidden transition-all hover:scale-105 ring-2 ring-white/20"
           >
             <span className="relative z-10 flex items-center gap-2">
               {hasStarted ? "Navigate Portfolio" : portfolioData.hero.buttonText} 
               <span className="group-hover:translate-x-1 transition-transform">✈</span>
             </span>
             <div className="absolute inset-0 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
           </button>
        </div>
      </div>

      {/* Side Content Panel */}
      <aside 
        ref={scrollContainerRef}
        className={activeSection === 'home' ? 'hidden' : panelClass}
        onScroll={handleScroll}
      >
        
        {/* Experience Section */}
        {activeSection === 'experience' && (
          <div className="animate-fade-in-up pb-10">
            <h2 
              className="text-4xl font-bold mb-8 border-b border-primary/30 pb-4 text-primary sticky top-0 z-20 transition-opacity duration-300"
              style={{ opacity: scrollOpacity }}
            >
              {portfolioData.sectionTitles.experience}
            </h2>
            <div className="space-y-12 pt-4">
              {portfolioData.experience.map((job, index) => (
                <div key={index} className="relative pl-8 border-l-2 border-primary/30 hover:border-primary transition-colors">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-bgPrimary border-2 border-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                  <h3 className="text-xl font-bold text-white break-words leading-tight mb-1">{job.role}</h3>
                  <div className="text-primary font-medium mb-2">{job.company}</div>
                  <div className="text-sm text-gray-400 mb-4 font-mono">{job.date}</div>
                  <p className="text-gray-300 leading-relaxed">{job.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div className="animate-fade-in-up pb-10">
             <h2 
              className="text-4xl font-bold mb-8 border-b border-primary/30 pb-4 text-primary sticky top-0 z-20 transition-opacity duration-300"
              style={{ opacity: scrollOpacity }}
            >
              {portfolioData.sectionTitles.skills}
            </h2>
            <div className="grid grid-cols-1 gap-8 pt-4">
              {portfolioData.skills.map((cat, index) => (
                <div key={index} className="bg-bgPrimary/50 p-6 rounded-xl border border-gray-700/50 hover:border-primary/50 transition-all shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-accent">{cat.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, sIndex) => (
                      <span key={sIndex} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="animate-fade-in-up pb-10">
            <h2 
              className="text-4xl font-bold mb-8 border-b border-primary/30 pb-4 text-primary sticky top-0 z-20 transition-opacity duration-300"
              style={{ opacity: scrollOpacity }}
            >
              {portfolioData.sectionTitles.projects}
            </h2>
            <div className="space-y-8 pt-4">
              {portfolioData.projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <div className="h-full flex flex-col justify-center animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-8 border-b border-primary/30 pb-4 text-primary">
              {portfolioData.contact.title}
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              {portfolioData.contact.description}
            </p>
            <div className="space-y-6">
              <a href={`mailto:${portfolioData.contact.email}`} className="flex items-center gap-4 p-4 bg-bgPrimary/50 rounded-xl hover:bg-primary/20 transition-all group border border-transparent hover:border-primary/30 break-all">
                <div className="p-3 bg-primary/20 rounded-full group-hover:bg-primary group-hover:text-white text-primary transition-colors shadow-lg shrink-0">
                  <Mail size={24} />
                </div>
                <span className="text-lg font-medium">{portfolioData.contact.email}</span>
              </a>
              <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-bgPrimary/50 rounded-xl hover:bg-primary/20 transition-all group border border-transparent hover:border-primary/30">
                <div className="p-3 bg-primary/20 rounded-full group-hover:bg-primary group-hover:text-white text-primary transition-colors shadow-lg shrink-0">
                  <Linkedin size={24} />
                </div>
                <span className="text-lg font-medium">LinkedIn Profile</span>
              </a>
              <a href={portfolioData.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-bgPrimary/50 rounded-xl hover:bg-primary/20 transition-all group border border-transparent hover:border-primary/30">
                <div className="p-3 bg-primary/20 rounded-full group-hover:bg-primary group-hover:text-white text-primary transition-colors shadow-lg shrink-0">
                  <Github size={24} />
                </div>
                <span className="text-lg font-medium">GitHub Profile</span>
              </a>
            </div>
            
            <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-gray-400 italic">
                    {portfolioData.contact.quote}
                </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Overlay;
