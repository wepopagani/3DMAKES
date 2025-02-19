import React, { useState, useCallback } from 'react';
import { Language, translations } from '../utils/translations';
import { blogPosts } from '../utils/content';

interface BlogSectionProps {
  language: Language;
}

export default function BlogSection({ language }: BlogSectionProps) {
  const t = translations[language].blog;
  const posts = blogPosts[language];

  const [selectedPost, setSelectedPost] = useState<(typeof posts)[0] | null>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);

  const handleImageLoad = useCallback((postId: string) => {
    setImageLoaded(prev => ({ ...prev, [postId]: true }));
  }, []);

  const handleImageError = useCallback(() => {
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  }, []);

  const openModal = useCallback((post: (typeof posts)[0]) => {
    setSelectedPost(post);
    document.body.style.overflow = 'hidden';
  }, []);

  const displayedPosts = showAll ? posts : posts.slice(0, 2);

  return (
    <section id="blog" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 sm:mb-16">
          {t.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {displayedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm hover:transform hover:-translate-y-1 transition-all cursor-pointer"
              onClick={() => openModal(post)}
            >
              <div className="relative h-48 sm:h-56">
                {!imageLoaded[post.id] && (
                  <div className="absolute inset-0 bg-gray-700 animate-pulse" />
                )}
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded[post.id] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(post.id)}
                  onError={() => handleImageError()}
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center text-sm text-gray-400 mb-3 sm:mb-4">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} {t.readTime}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm sm:text-base">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm">
                  <span className="text-gray-300">{t.by} {post.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white rounded-lg text-base sm:text-lg font-semibold hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-500/20"
          >
            {showAll ? t.showLess : t.readMore}
          </button>
        </div>

        {/* Blog Post Modal */}
        {selectedPost && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <div 
              className="bg-gray-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-64 sm:h-96">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  ×
                </button>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                    {selectedPost.category}
                  </span>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedPost.readTime} {t.readTime}</span>
                  <span className="mx-2">•</span>
                  <span>{t.by} {selectedPost.author}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  {selectedPost.title}
                </h3>
                <div className="prose prose-invert max-w-none">
                  {selectedPost.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-300 mb-4 text-sm sm:text-base">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}