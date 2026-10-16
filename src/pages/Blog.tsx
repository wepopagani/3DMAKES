import { getBlogPosts } from "@/data/blogContent";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, UserRound } from "lucide-react";
import { BlogCard, GRID_CARD_LAYOUT } from "@/components/anteprima/BlogBento";
import { useGoToContact } from "@/components/anteprima/hooks";
import { CtaBand, FilterChips, PageHero, TiltPhoto, WRAP_LONG_WORDS } from "@/components/anteprima/PageBlocks";
import PageShell from "@/components/anteprima/PageShell";
import { HEADING_2, PressLink, Reveal, SplitWords } from "@/components/anteprima/primitives";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = "__all";
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const Blog = () => {
  const { t } = useTranslation();
  const goToContact = useGoToContact();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get translated blog posts
  const blogPosts = useMemo(() => getBlogPosts(), [t]);
  
  // Estrai categorie uniche dai post del blog
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));
  
  // Trova l'ultimo post featured da mostrare in evidenza
  const featuredPost = blogPosts.find(post => post.featured);
  
  // Filtra i post in base alla categoria selezionata, escludendo il post featured
  const filteredPosts = selectedCategory 
    ? blogPosts.filter(post => post.category === selectedCategory && post.id !== featuredPost?.id) 
    : blogPosts.filter(post => post.id !== featuredPost?.id);
  
  // Effect to handle page load scrolling
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filters = [
    { id: ALL_CATEGORIES, label: t('common.all') },
    ...categories.map((category) => ({ id: category, label: category })),
  ];
  
  return (
    <PageShell>
      <PageHero title={t('blog.title')} subtitle={t('blog.subtitle')} />

      {/* Articolo in evidenza */}
      {featuredPost && (
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="min-w-0">
              <Reveal y={12} className="mb-4 inline-block rounded-full bg-brand-accent/10 px-3 py-1 text-sm font-medium text-brand-accent">
                {featuredPost.category}
              </Reveal>
              <h2 className={cn(HEADING_2, WRAP_LONG_WORDS, "mb-6 text-brand-blue")}>
                <SplitWords text={featuredPost.title} />
              </h2>
              <Reveal delay={0.15}>
                <p className="body-text mb-6">{featuredPost.excerpt}</p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-brand-gray">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays aria-hidden className="h-4 w-4 text-brand-accent" />
                    {t('blog.publishedOn')} {featuredPost.date}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <UserRound aria-hidden className="h-4 w-4 text-brand-accent" />
                    {t('blog.by')} {featuredPost.author}
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.25}>
                <PressLink to={`/blog/${featuredPost.id}`} size="lg" arrow>
                  {t('blog.readMore')}
                </PressLink>
              </Reveal>
            </div>
            <Reveal x={48} y={0} delay={0.15} className="relative min-w-0">
              <div aria-hidden className="absolute -left-4 -top-4 h-32 w-32 rounded-3xl bg-brand-accent/10 md:-left-6 md:-top-6" />
              <Link to={`/blog/${featuredPost.id}`} tabIndex={-1} aria-hidden className="relative block">
                <TiltPhoto src={featuredPost.imageSrc} alt={featuredPost.title} />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Tutti gli articoli */}
      <section className="bg-[#E5DDD3] py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h2
                key={selectedCategory ?? ALL_CATEGORIES}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className={cn(HEADING_2, WRAP_LONG_WORDS, "min-w-0 text-brand-blue")}
              >
                {selectedCategory ? t('blog.articlesCategory', { category: selectedCategory }) : t('blog.allArticles')}
              </motion.h2>
            </AnimatePresence>
            <FilterChips
              options={filters}
              active={selectedCategory ?? ALL_CATEGORIES}
              onChange={(id) => setSelectedCategory(id === ALL_CATEGORIES ? null : id)}
              layoutId="blog-categoria-attiva"
              label={t('blog.allArticles')}
            />
          </div>

          {filteredPosts.length > 0 ? (
            <Reveal y={20}>
              <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                <AnimatePresence mode="popLayout" initial={false}>
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                      className="h-full"
                    >
                      <BlogCard post={post} layout={GRID_CARD_LAYOUT} readMoreLabel={t('blog.readMore')} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Reveal>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-brand-gray">{t('blog.noArticlesFound')}</p>
            </div>
          )}
        </div>
      </section>

      <CtaBand title={t('blog.moreServicesTitle')} text={t('blog.moreServicesDescription')}>
        <PressLink to="/services" variant="accent" size="lg" arrow>
          {t('nav.services')}
        </PressLink>
        <PressLink to="/faq" variant="outlineLight" size="lg">
          {t('nav.faq')}
        </PressLink>
        <PressLink
          to="/#contact"
          variant="light"
          size="lg"
          onClick={(event) => {
            event.preventDefault();
            goToContact();
          }}
        >
          {t('contact.title')}
        </PressLink>
      </CtaBand>
    </PageShell>
  );
};

export default Blog;
