import React from 'react';
import { Link } from 'react-router-dom';

const ProjectDetail: React.FC = () => {
  // Assuming project is defined in the component's state or props
  const project = {
    cta: {
      text: 'Customize your bowl',
      link: '/ciotole-personalizzabili'
    }
  };

  return (
    <div>
      {/* Rest of the component content */}
      {project.cta && (
        <div className="mt-6">
          <Link 
            to={project.cta.link} 
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
          >
            {project.cta.text}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail; 