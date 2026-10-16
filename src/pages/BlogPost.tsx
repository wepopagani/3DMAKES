import { useParams, useNavigate } from "react-router-dom";
import { getBlogPosts, blogPostsContent } from "@/data/blogContent";
import { useEffect, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { CalendarDays, ShieldCheck, UserRound } from "lucide-react";
import { BlogCard, GRID_CARD_LAYOUT } from "@/components/anteprima/BlogBento";
import { CheckDot, CtaBand, PageHero, SectionIntro } from "@/components/anteprima/PageBlocks";
import PageShell from "@/components/anteprima/PageShell";
import { PressAnchor, PressLink, Reveal, Stagger, StaggerItem, WipeImage } from "@/components/anteprima/primitives";

const SIDEBAR_CARD = "rounded-3xl bg-[#E5DDD3]/45 p-6 ring-1 ring-brand-blue/5";

const BlogPostPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get translated blog posts
  const blogPosts = useMemo(() => getBlogPosts(), [t]);
  
  // Trova il post del blog dal parametro ID
  const post = blogPosts.find(post => post.id === id);
  
  // Trova il contenuto completo del post
  const rawContent = id ? blogPostsContent[id as keyof typeof blogPostsContent] : null;

  // Seleziona la versione corretta in base alla lingua attiva (fallback su italiano)
  const postContent = useMemo(() => {
    if (!rawContent) return null;
    const isEn = i18n.language?.toLowerCase().startsWith('en');
    const anyContent = rawContent as any;
    return {
      ...rawContent,
      title: isEn && anyContent.titleEn ? anyContent.titleEn : rawContent.title,
      content: isEn && anyContent.contentEn ? anyContent.contentEn : rawContent.content,
    };
  }, [rawContent, i18n.language]);
  
  // Reindirizza alla pagina 404 se il post non esiste
  useEffect(() => {
    if (!post) {
      navigate('/404', { replace: true });
    }
  }, [post, navigate]);
  
  // Scroll all'inizio della pagina quando il componente viene montato
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  // Article + Author structured data (Schema.org)
  useEffect(() => {
    if (!post) return;

    const CANONICAL_BASE_URL = "https://3dmakes.ch";
    const pageUrl = `${CANONICAL_BASE_URL}/blog/${post.id}/`;

    const monthMap: Record<string, number> = {
      Jan: 0, Gen: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4, Mag: 4,
      Jun: 5, Giu: 5,
      Jul: 6, Lug: 6,
      Aug: 7, Ago: 7,
      Sep: 8, Set: 8,
      Oct: 9, Ott: 9,
      Nov: 10,
      Dec: 11, Dic: 11,
    };

    const parseBlogDate = (dateStr: string) => {
      // formati: "20 Apr 2023" oppure "16 Ago 2026"
      const parts = dateStr.split(" ");
      if (parts.length !== 3) return null;
      const day = Number(parts[0]);
      const month = monthMap[parts[1]];
      const year = Number(parts[2]);
      if (Number.isNaN(day) || month === undefined || Number.isNaN(year)) return null;
      const d = new Date(Date.UTC(year, month, day));
      return d.toISOString();
    };

    const isoDate = parseBlogDate(post.date);
    const imageUrl = post.imageSrc.startsWith("http")
      ? post.imageSrc
      : `${CANONICAL_BASE_URL}${post.imageSrc.startsWith("/") ? post.imageSrc : `/${post.imageSrc}`}`;

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${pageUrl}#article`,
      headline: post.title,
      description: post.excerpt,
      image: [imageUrl],
      datePublished: isoDate ?? undefined,
      dateModified: isoDate ?? undefined,
      author: {
        "@type": "Person",
        name: post.author,
        sameAs: "https://ch.linkedin.com/company/3d-makes",
      },
      publisher: {
        "@type": "Organization",
        name: "3DMAKES",
        logo: {
          "@type": "ImageObject",
          url: `${CANONICAL_BASE_URL}/images/3dmakes-logo.png`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": pageUrl,
      },
      isPartOf: {
        "@type": "Blog",
        "@id": `${CANONICAL_BASE_URL}/blog/#blog`,
        name: "3DMAKES",
      },
      inLanguage: i18n.language,
    };

    const ARTICLE_SCHEMA_ID = "article-author-schema-blogpost";
    const existing = document.getElementById(ARTICLE_SCHEMA_ID) as HTMLScriptElement | null;
    const json = JSON.stringify(articleSchema);

    if (existing) {
      existing.textContent = json;
    } else {
      const script = document.createElement("script");
      script.id = ARTICLE_SCHEMA_ID;
      script.type = "application/ld+json";
      script.textContent = json;
      document.head.appendChild(script);
    }

    return () => {
      const el = document.getElementById(ARTICLE_SCHEMA_ID);
      el?.remove();
    };
  }, [post, i18n.language]);

  // Ottieni 3 post correlati (escludi il post corrente)
  const relatedPosts = blogPosts
    .filter(p => p.id !== id)
    .filter(p => p.category === post?.category)
    .slice(0, 3);
  
  // Se non ci sono abbastanza post nella stessa categoria, aggiungi altri post casuali
  if (relatedPosts.length < 3) {
    const additionalPosts = blogPosts
      .filter(p => p.id !== id && !relatedPosts.some(rp => rp.id === p.id))
      .slice(0, 3 - relatedPosts.length);
    
    relatedPosts.push(...additionalPosts);
  }
  
  if (!post) {
    return <div>{t('common.loading')}</div>;
  }

  const challenges: unknown = (postContent as any)?.challenges;
  const benefits: unknown = (postContent as any)?.benefits;
  
  return (
    <PageShell>
      <PageHero
        back={{ to: "/blog", label: t('blog.title') }}
        title={post.title}
        titleClassName="text-[clamp(1.75rem,6.5vw,3.25rem)]"
        badge={
          <Reveal y={10} className="mb-6 inline-block rounded-full bg-brand-accent/20 px-3 py-1 text-sm font-medium text-white">
            {post.category}
          </Reveal>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-300">
          <span className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden className="h-4 w-4 text-brand-accent" />
            {t('blog.publishedOn')} {post.date}
          </span>
          <span className="inline-flex items-center gap-2">
            <UserRound aria-hidden className="h-4 w-4 text-brand-accent" />
            {t('blog.by')} {post.author}
          </span>
        </div>
      </PageHero>

      {/* Immagine dell'articolo */}
      <div className="container-custom relative z-10 -mt-10 md:-mt-16">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-brand-blue/5 shadow-2xl shadow-brand-blue/20 ring-1 ring-black/5">
          <WipeImage src={post.imageSrc} alt={post.title} className="block h-64 w-full object-cover sm:h-80 md:h-[26rem]" />
        </div>
      </div>

      {/* Contenuto */}
      <section className="bg-white py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-8">
              <Reveal y={20}>
                <div
                  className="
                    prose prose-lg max-w-none break-words
                    prose-headings:font-bold prose-headings:text-brand-blue prose-headings:scroll-mt-24
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-brand-accent
                    prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2
                    prose-p:text-brand-gray prose-p:leading-relaxed prose-p:mb-5
                    prose-a:text-brand-accent hover:prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-ul:my-5 prose-ul:space-y-1 prose-li:marker:text-brand-accent
                    prose-ol:my-5 prose-ol:space-y-1
                    prose-blockquote:border-l-brand-accent prose-blockquote:rounded-r-2xl prose-blockquote:bg-[#E5DDD3]/40 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic
                    prose-code:text-brand-accent prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                    prose-hr:border-gray-200
                  "
                >
                  {postContent ? (
                    <>
                      <p className="lead text-xl text-brand-gray !mb-8 !mt-0 font-medium">{post.excerpt}</p>

                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                      >
                        {postContent.content}
                      </ReactMarkdown>
                    </>
                  ) : (
                    <p className="text-xl text-brand-gray mb-8">{post.excerpt}</p>
                  )}
                </div>
              </Reveal>

              {/* Autore */}
              <Reveal className="mt-12">
                <div className="group flex items-center gap-4 rounded-3xl bg-[#E5DDD3]/45 p-6 ring-1 ring-brand-blue/5">
                  <motion.div
                    aria-hidden
                    whileHover={{ rotate: -8, scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 380, damping: 18 }}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xl font-bold text-white shadow-lg shadow-brand-blue/20"
                  >
                    {post.author.substring(0, 1)}
                  </motion.div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-brand-blue">{post.author}</h3>
                    <p className="text-sm text-brand-gray">{t('blog.author')}</p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Sidebar */}
            <aside className="min-w-0 lg:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-28">
                {postContent?.details && (
                  <Reveal x={32} y={0}>
                    <div className={SIDEBAR_CARD}>
                      <h3 className="mb-4 text-lg font-semibold text-brand-blue">{t('blog.technicalDetails')}</h3>
                      <dl className="space-y-3">
                        {Object.entries(postContent.details).map(([key, value]) => (
                          <div key={key} className="border-b border-brand-blue/10 pb-3 last:border-0 last:pb-0">
                            <dt className="text-sm capitalize text-brand-gray">{key}</dt>
                            <dd className="mt-0.5 break-words font-medium text-brand-blue">{value as string}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </Reveal>
                )}

                {Array.isArray(challenges) && (
                  <Reveal x={32} y={0} delay={0.1}>
                    <div className={SIDEBAR_CARD}>
                      <h3 className="mb-4 text-lg font-semibold text-brand-blue">{t('blog.challenges')}</h3>
                      <Stagger className="space-y-3" stagger={0.06}>
                        {challenges.map((challenge: string, index: number) => (
                          <StaggerItem key={index}>
                            <div className="group flex items-start gap-3">
                              <span
                                aria-hidden
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-white"
                              >
                                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                              </span>
                              <span className="text-brand-blue/90">{challenge}</span>
                            </div>
                          </StaggerItem>
                        ))}
                      </Stagger>
                    </div>
                  </Reveal>
                )}

                {Array.isArray(benefits) && (
                  <Reveal x={32} y={0} delay={0.2}>
                    <div className={SIDEBAR_CARD}>
                      <h3 className="mb-4 text-lg font-semibold text-brand-blue">{t('blog.benefits')}</h3>
                      <Stagger className="space-y-3" stagger={0.06}>
                        {benefits.map((benefit: string, index: number) => (
                          <StaggerItem key={index}>
                            <div className="group flex items-start gap-3">
                              <CheckDot />
                              <span className="text-brand-blue/90">{benefit}</span>
                            </div>
                          </StaggerItem>
                        ))}
                      </Stagger>
                    </div>
                  </Reveal>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Articoli correlati */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#E5DDD3] py-16 md:py-24">
          <div className="container-custom">
            <SectionIntro align="left" title={t('blog.relatedPosts')} />
            <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {relatedPosts.map((relatedPost) => (
                <StaggerItem key={relatedPost.id} className="h-full">
                  <BlogCard post={relatedPost} layout={GRID_CARD_LAYOUT} readMoreLabel={t('blog.readMore')} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <CtaBand title={t('blog.projectInMind')} text={t('blog.contactDescription')}>
        <PressLink to="/calculator" variant="accent" size="lg" arrow>
          {t('footer.calculateQuote')}
        </PressLink>
        <PressLink to="/services" variant="outlineLight" size="lg">
          {t('nav.services')}
        </PressLink>
        <PressLink to="/faq" variant="outlineLight" size="lg">
          {t('nav.faq')}
        </PressLink>
        <PressAnchor href="mailto:info@3dmakes.ch" variant="light" size="lg">
          {t('contact.title')}
        </PressAnchor>
      </CtaBand>
    </PageShell>
  );
};

export default BlogPostPage;
