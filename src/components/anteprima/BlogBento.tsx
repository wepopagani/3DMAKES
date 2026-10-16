import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getBlogPosts } from "@/data/blogContent";
import { cn } from "@/lib/utils";
import { BLOG_HEADER_IMAGE, BLOG_READ_MORE } from "./data";
import { HEADING_2, InteractiveCard, PressLink, Reveal, SplitWords, Stagger, StaggerItem, WipeImage } from "./primitives";

export type BlogPostItem = ReturnType<typeof getBlogPosts>[number];

export interface CardLayout {
  cell: string;
  image: string;
  body: string;
  title: string;
}

/** Il primo articolo occupa due righe (l'immagine assorbe l'altezza); gli altri riempiono la griglia senza buchi. */
const LAYOUTS: CardLayout[] = [
  {
    cell: "md:col-span-2 lg:col-span-4 lg:row-span-2",
    image: "h-56 sm:h-72 lg:h-auto lg:min-h-[18rem] lg:flex-1",
    body: "md:p-8",
    title: "text-2xl md:text-3xl",
  },
  { cell: "lg:col-span-2", image: "h-48", body: "flex-1", title: "text-xl" },
  { cell: "lg:col-span-2", image: "h-48", body: "flex-1", title: "text-xl" },
  { cell: "lg:col-span-3", image: "h-48 lg:h-56", body: "flex-1", title: "text-xl" },
  { cell: "lg:col-span-3", image: "h-48 lg:h-56", body: "flex-1", title: "text-xl" },
];

/** Card standard per le griglie regolari (pagina blog, articoli correlati). */
export const GRID_CARD_LAYOUT = LAYOUTS[1];

interface BlogCardProps {
  post: BlogPostItem;
  layout: CardLayout;
  readMoreLabel?: string;
}

export function BlogCard({ post, layout, readMoreLabel = BLOG_READ_MORE }: BlogCardProps) {
  return (
    <InteractiveCard
      lift={8}
      className="h-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 focus-within:ring-2 focus-within:ring-brand-accent focus-within:ring-offset-2 hover:shadow-2xl"
    >
      <div className="flex h-full flex-col">
        <div className={cn("relative shrink-0 overflow-hidden bg-brand-blue/5", layout.image)}>
          <img
            src={post.imageSrc}
            alt={post.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <span
            aria-hidden
            className="absolute right-4 top-4 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-white/90 text-brand-blue opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
        <div className={cn("flex flex-col p-6", layout.body)}>
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-block rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-accent">
              {post.category}
            </span>
            <span className="ml-auto text-sm text-brand-gray">{post.date}</span>
          </div>
          <h3
            className={cn(
              "mb-3 font-semibold leading-snug text-brand-blue transition-colors duration-300 group-hover:text-brand-accent",
              layout.title
            )}
          >
            <Link to={`/blog/${post.id}`} className="after:absolute after:inset-0 focus:outline-none">
              {post.title}
            </Link>
          </h3>
          <p className="mb-4 flex-grow text-brand-gray">{post.excerpt}</p>
          <div className="mt-auto flex items-center border-t border-gray-100 pt-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-sm font-medium text-white">
              {post.author.substring(0, 1)}
            </span>
            <span className="ml-2 text-sm font-medium">{post.author}</span>
            <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-brand-accent">
              {readMoreLabel}
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </span>
          </div>
        </div>
      </div>
    </InteractiveCard>
  );
}

export default function BlogBento() {
  const { t } = useTranslation();
  const posts = getBlogPosts().slice(0, 5);

  return (
    <section className="bg-white pb-16 pt-8 md:pb-24 md:pt-12">
      <div className="container-custom">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-6">
            <WipeImage
              src={BLOG_HEADER_IMAGE.src}
              alt={BLOG_HEADER_IMAGE.alt}
              width={BLOG_HEADER_IMAGE.width}
              height={BLOG_HEADER_IMAGE.height}
              className="mx-auto h-auto w-full max-w-lg"
            />
          </div>
          <h2 className={cn(HEADING_2, "mb-6 text-brand-blue lg:text-4xl")}>
            <SplitWords text={t("blog.subtitle")} />
          </h2>
          <Reveal delay={0.15}>
            <p className="body-text">{t("services.description")}</p>
          </Reveal>
        </div>

        <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {posts.map((post, index) => {
            const layout = LAYOUTS[index] ?? LAYOUTS[1];
            return (
              <StaggerItem key={post.id} className={cn("h-full", layout.cell)}>
                <BlogCard post={post} layout={layout} />
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="mt-12 text-center">
          <PressLink to="/blog" variant="outlineDark" arrow>
            {t("blog.allArticles")}
          </PressLink>
        </Reveal>
      </div>
    </section>
  );
}
