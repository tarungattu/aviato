import React from 'react';
import { Github, ExternalLink, FileText } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <div className="bg-bgPrimary/50 p-6 rounded-xl border border-gray-700/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 transition-all group">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{project.title}</h3>
      <div className="flex gap-3">
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="View Code">
            <Github size={20} />
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Live Demo">
            <ExternalLink size={20} />
          </a>
        )}
        {project.publication && (
          <a href={project.publication} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Read Publication">
            <FileText size={20} />
          </a>
        )}
      </div>
    </div>
    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{project.description}</p>
    <div className="flex flex-wrap gap-2">
      {project.technologies.map((tech, tIndex) => (
        <span key={tIndex} className="text-xs font-mono text-primary/80">#{tech}</span>
      ))}
    </div>
  </div>
);

export default ProjectCard;