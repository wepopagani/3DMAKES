import { useState } from 'react';
import { Language, translations } from '../utils/translations';
import { projects } from '../utils/content';

interface ProjectsSectionProps {
  language: Language;
}

export default function ProjectsSection({ language }: ProjectsSectionProps) {
  const t = translations[language].projects;
  const allProjects = projects[language];
  
  // Aggiungiamo gli stati per gestire mostra più/meno e il progetto selezionato
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState<(typeof allProjects)[0] | null>(null);

  // Mostra solo 2 progetti o tutti in base allo state showAll
  const displayedProjects = showAll ? allProjects : allProjects.slice(0, 2);

  return (
    <section id="projects" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          {t.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm hover:transform hover:-translate-y-1 transition-all cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-48">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {project.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">{t.details.material}</p>
                    <p className="text-white">{project.details.material}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{t.details.printTime}</p>
                    <p className="text-white">{project.details.printTime}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottone Mostra Più/Meno */}
        {allProjects.length > 2 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg text-base font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-500/20"
            >
              {showAll ? t.showLess : t.showMore}
            </button>
          </div>
        )}

        {/* Project Modal */}
        {selectedProject && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-hidden"
            onClick={() => setSelectedProject(null)}
          >
            <div 
              className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fade-in"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-96 flex-shrink-0">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-8 overflow-y-auto">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {selectedProject.title}
                    </h3>
                    <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                      {selectedProject.category}
                    </span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 mb-8 whitespace-pre-line">
                    {selectedProject.longDescription}
                  </div>

                  {selectedProject.challenges && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-3">{t.details.challenges}</h4>
                      <ul className="list-disc pl-5 text-gray-300 space-y-2">
                        {selectedProject.challenges.map((challenge, index) => (
                          <li key={index}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedProject.benefits && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-3">{t.details.benefits}</h4>
                      <ul className="list-disc pl-5 text-gray-300 space-y-2">
                        {selectedProject.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Aggiungi qui il bottone CTA */}
                  {selectedProject.cta && (
                    <div className="mt-8 mb-6">
                      <a 
                        href={selectedProject.cta.link} 
                        className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors shadow-lg hover:shadow-red-500/20"
                      >
                        {selectedProject.cta.text}
                      </a>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-700">
                  <div>
                    <p className="text-gray-500 text-sm">{t.details.material}</p>
                    <p className="text-white font-medium">
                      {selectedProject.details.material}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{t.details.printTime}</p>
                    <p className="text-white font-medium">
                      {selectedProject.details.printTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{t.details.quality}</p>
                    <p className="text-white font-medium">
                      {selectedProject.details.quality}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{t.details.size}</p>
                    <p className="text-white font-medium">
                      {selectedProject.details.size}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}