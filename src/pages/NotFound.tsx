import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHero } from '@/components/anteprima/PageBlocks';
import PageShell from '@/components/anteprima/PageShell';
import { PressLink, Reveal } from '@/components/anteprima/primitives';

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageShell>
      <PageHero title="404" titleClassName="mb-2 text-[clamp(6rem,26vw,11rem)] leading-none text-brand-accent">
        <div className="pb-8 md:pb-12">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">{t('notFound.title')}</h2>
          <p className="mt-2 text-gray-300">{t('notFound.description')}</p>
          <Reveal delay={0.2} className="mt-8">
            <PressLink to="/" variant="accent" size="lg" arrow>
              {t('notFound.backHome')}
            </PressLink>
          </Reveal>
        </div>
      </PageHero>
    </PageShell>
  );
};

export default NotFound;
