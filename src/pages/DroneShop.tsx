import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Check,
  ChevronRight,
  Package,
  Plane,
  Boxes,
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';

// ─────────────────────────────────────────────────────────────────────────────
// Catalog — placeholder prices, fill in real CHF amounts later.
// `null` price renders as "Prezzo in fase di definizione" and skips the total.
// ─────────────────────────────────────────────────────────────────────────────

type BundleId = 'frame' | 'drone' | 'full';
type RadioChoice = 'crossfire' | 'elrs';
type MotorSpacing = '9x9' | '12x12';

const BUNDLE_PRICES: Record<BundleId, number | null> = {
  frame: 79,
  drone: 549,
  full: 999,
};

// Prezzo singolo "visualizzato" per ogni accessorio normale (non-box).
const ACCESSORY_PRICE = 10;
// Prezzo box drone (accessorio dal pricing dedicato).
const BOX_PRICE = 45;
// Prezzo pack "tutti gli accessori" (include anche il box).
const ACCESSORY_PACK_PRICE = 69;

// Tier quantità per gli accessori "normali" (tutti tranne il box).
// count → prezzo totale. Fallback lineare (count × 10) per quantità non mappate.
const ACCESSORY_TIER: Record<number, number> = {
  1: 10,
  2: 15,
  3: 30,
};

function normalAccessoriesTotal(count: number): number {
  if (count <= 0) return 0;
  if (ACCESSORY_TIER[count] !== undefined) return ACCESSORY_TIER[count];
  return count * ACCESSORY_PRICE;
}

const ACCESSORY_IDS = [
  'vtxSet',
  'gps12x16',
  'gps18x18',
  'gps21x21',
  'antennaMount',
  'actionCamMount',
  'box',
] as const;

type AccessoryId = (typeof ACCESSORY_IDS)[number];

const PLACEHOLDER_IMG = '/images/droni/accessori-placeholder.svg';

// Per ogni accessorio la relativa foto. Se mancante si mostra il placeholder.
const ACCESSORY_IMAGES: Record<AccessoryId, string | null> = {
  vtxSet: '/images/droni/vtx-set.png',
  gps12x16: '/images/droni/gps-12x16.png',
  gps18x18: '/images/droni/gps-18x18.png',
  gps21x21: '/images/droni/gps-21x21.png',
  antennaMount: '/images/droni/antenna-mount.png',
  actionCamMount: '/images/droni/action-cam-mount.png',
  box: '/images/droni/box.png',
};

type Material = 'ASA' | 'TPU' | 'PETG';

// Materiale di stampa per ogni accessorio (tutti in colore nero).
const ACCESSORY_MATERIAL: Record<AccessoryId, Material> = {
  vtxSet: 'ASA',
  gps12x16: 'TPU',
  gps18x18: 'TPU',
  gps21x21: 'TPU',
  antennaMount: 'TPU',
  actionCamMount: 'ASA',
  box: 'PETG',
};

const MATERIAL_COLORS: Record<Material, string> = {
  ASA: 'bg-sky-100 text-sky-700 ring-sky-200',
  TPU: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  PETG: 'bg-amber-100 text-amber-700 ring-amber-200',
};

// WhatsApp target (same number as the floating button on the site)
const WA_PHONE = '41762660396';

// ─────────────────────────────────────────────────────────────────────────────

function formatPrice(amount: number | null): string {
  if (amount === null) return '—';
  return `CHF ${amount.toLocaleString('de-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ─────────────────────────────────────────────────────────────────────────────

const DroneShop = () => {
  const { t } = useTranslation();

  const [bundle, setBundle] = useState<BundleId | null>(null);
  const [radio, setRadio] = useState<RadioChoice>('elrs');
  const [motorSpacing, setMotorSpacing] = useState<MotorSpacing>('9x9');
  const [allAccessories, setAllAccessories] = useState(false);
  const [previewId, setPreviewId] = useState<AccessoryId | null>(null);
  const [accessories, setAccessories] = useState<Record<AccessoryId, boolean>>({
    vtxSet: false,
    gps12x16: false,
    gps18x18: false,
    gps21x21: false,
    antennaMount: false,
    actionCamMount: false,
    box: false,
  });

  function toggleBundle(id: BundleId) {
    setBundle((cur) => (cur === id ? null : id));
  }

  function toggleAccessory(id: AccessoryId) {
    if (allAccessories) setAllAccessories(false);
    setAccessories((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleAll() {
    setAllAccessories((cur) => {
      const next = !cur;
      if (next) {
        setAccessories({
          vtxSet: false,
          gps12x16: false,
          gps18x18: false,
          gps21x21: false,
          antennaMount: false,
          actionCamMount: false,
          box: false,
        });
      }
      return next;
    });
  }

  const selectedAccessoryIds = useMemo(
    () =>
      ACCESSORY_IDS.filter((id) => accessories[id]),
    [accessories],
  );

  // Preview: hover ha priorità, poi ultimo selezionato con foto, poi primo con foto, poi placeholder.
  const previewSrc = useMemo(() => {
    if (previewId && ACCESSORY_IMAGES[previewId]) {
      return ACCESSORY_IMAGES[previewId]!;
    }
    const selectedWithImg = [...selectedAccessoryIds]
      .reverse()
      .find((id) => ACCESSORY_IMAGES[id]);
    if (selectedWithImg) return ACCESSORY_IMAGES[selectedWithImg]!;
    const firstWithImg = ACCESSORY_IDS.find((id) => ACCESSORY_IMAGES[id]);
    return firstWithImg ? ACCESSORY_IMAGES[firstWithImg]! : PLACEHOLDER_IMG;
  }, [previewId, selectedAccessoryIds]);

  const previewCaptionId: AccessoryId | null =
    previewId ??
    ([...selectedAccessoryIds].reverse().find((id) => ACCESSORY_IMAGES[id]) ??
      ACCESSORY_IDS.find((id) => ACCESSORY_IMAGES[id]) ??
      null);

  const cartIsEmpty =
    !bundle && !allAccessories && selectedAccessoryIds.length === 0;

  // Separo box dagli accessori "normali" perché hanno pricing diverso.
  const normalAccessoryIds = useMemo(
    () => selectedAccessoryIds.filter((id) => id !== 'box'),
    [selectedAccessoryIds],
  );
  const boxSelected = accessories.box && !allAccessories;

  const quantityDiscount = useMemo(() => {
    const count = normalAccessoryIds.length;
    const base = count * ACCESSORY_PRICE;
    const actual = normalAccessoriesTotal(count);
    return base - actual;
  }, [normalAccessoryIds]);

  const total = useMemo(() => {
    let sum = 0;
    const hasPlaceholder = false;

    if (bundle) {
      const p = BUNDLE_PRICES[bundle];
      if (p !== null) sum += p;
    }
    if (allAccessories) {
      sum += ACCESSORY_PACK_PRICE;
    } else {
      sum += normalAccessoriesTotal(normalAccessoryIds.length);
      if (boxSelected) sum += BOX_PRICE;
    }
    return { sum, hasPlaceholder };
  }, [bundle, allAccessories, normalAccessoryIds, boxSelected]);

  function handleCheckout() {
    if (cartIsEmpty) return;

    const lines: string[] = [t('droneShop.waIntro'), ''];
    if (bundle) {
      const bundleName = t(`droneShop.bundles.${bundle}.title`);
      let extra = '';
      if (bundle === 'drone') {
        extra = ` · ${radio === 'crossfire' ? 'TBS Crossfire' : 'ELRS'}`;
      } else if (bundle === 'frame') {
        extra = ` · ${motorSpacing === '9x9' ? '9×9 mm' : '12×12 mm'}`;
      }
      const p = BUNDLE_PRICES[bundle];
      lines.push(`• ${bundleName}${extra} — ${p !== null ? formatPrice(p) : t('droneShop.priceTbd')}`);
    }
    if (allAccessories) {
      lines.push(`• ${t('droneShop.accessoryAll')} — ${formatPrice(ACCESSORY_PACK_PRICE)}`);
    } else {
      for (const id of normalAccessoryIds) {
        lines.push(`• ${t(`droneShop.accessories.${id}`)} — ${formatPrice(ACCESSORY_PRICE)}`);
      }
      if (quantityDiscount > 0) {
        lines.push(
          `  ${t('droneShop.quantityDiscount', { count: normalAccessoryIds.length })}: -${formatPrice(quantityDiscount)}`,
        );
      }
      if (boxSelected) {
        lines.push(`• ${t('droneShop.accessories.box')} — ${formatPrice(BOX_PRICE)}`);
      }
    }
    if (total.sum > 0) {
      lines.push('', `${t('droneShop.total')}: ${formatPrice(total.sum)}`);
    }

    const msg = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${WA_PHONE}?text=${msg}`, '_blank');
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-blue text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          aria-hidden
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="container-custom relative py-20 md:py-28">
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-brand-accent">
            <span className="inline-block h-px w-10 bg-brand-accent" aria-hidden />
            {t('droneShop.eyebrow')}
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">
            {t('droneShop.heroTitle')}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            {t('droneShop.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* ── Bundles ────────────────────────────────────────────────────── */}
      <section id="bundles" className="bg-gray-50 py-16 md:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-brand-blue md:text-4xl">
              {t('droneShop.bundlesTitle')}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t('droneShop.bundlesSubtitle')}
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <BundleCard
              active={bundle === 'frame'}
              onToggle={() => toggleBundle('frame')}
              title={t('droneShop.bundles.frame.title')}
              description={t('droneShop.bundles.frame.desc')}
              price={BUNDLE_PRICES.frame}
              icon={<Boxes className="h-7 w-7" />}
              index={0}
            >
              <fieldset className="mt-5">
                <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('droneShop.motorSpacing')}
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <RadioChip
                    label="9×9 mm"
                    selected={motorSpacing === '9x9'}
                    onClick={() => setMotorSpacing('9x9')}
                  />
                  <RadioChip
                    label="12×12 mm"
                    selected={motorSpacing === '12x12'}
                    onClick={() => setMotorSpacing('12x12')}
                  />
                </div>
              </fieldset>
            </BundleCard>

            <BundleCard
              active={bundle === 'drone'}
              onToggle={() => toggleBundle('drone')}
              title={t('droneShop.bundles.drone.title')}
              description={t('droneShop.bundles.drone.desc')}
              price={BUNDLE_PRICES.drone}
              icon={<Plane className="h-7 w-7" />}
              index={1}
            >
              <fieldset className="mt-5">
                <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('droneShop.radioSystem')}
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <RadioChip
                    label="TBS Crossfire"
                    selected={radio === 'crossfire'}
                    onClick={() => setRadio('crossfire')}
                  />
                  <RadioChip
                    label="ELRS"
                    selected={radio === 'elrs'}
                    onClick={() => setRadio('elrs')}
                  />
                </div>
              </fieldset>
            </BundleCard>

            <BundleCard
              active={bundle === 'full'}
              onToggle={() => toggleBundle('full')}
              title={t('droneShop.bundles.full.title')}
              description={t('droneShop.bundles.full.desc')}
              price={BUNDLE_PRICES.full}
              icon={<Package className="h-7 w-7" />}
              highlight
              index={2}
            >
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('droneShop.includes')}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {(t('droneShop.bundles.full.items', {
                    returnObjects: true,
                  }) as string[]).map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-foreground/80"
                    >
                      <Check className="h-4 w-4 shrink-0 text-brand-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </BundleCard>
          </div>
        </div>
      </section>

      {/* ── Accessories ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-brand-blue md:text-4xl">
              {t('droneShop.accessoriesTitle')}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t('droneShop.accessoriesSubtitle')}
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:mt-12 md:gap-8 xl:grid-cols-2">
            <div className="xl:sticky xl:top-24 xl:self-start">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-border">
                <img
                  key={previewSrc}
                  src={previewSrc}
                  alt={
                    previewCaptionId
                      ? t(`droneShop.accessories.${previewCaptionId}`)
                      : t('droneShop.accessoriesImageAlt')
                  }
                  className="h-full w-full scale-[1.8] object-contain p-2 motion-safe:animate-in motion-safe:fade-in-50 motion-safe:zoom-in-95 motion-safe:duration-300"
                />
                {previewCaptionId && (
                  <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl bg-brand-blue/90 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                    {t(`droneShop.accessories.${previewCaptionId}`)}
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0">
              {/* "Everything" master card */}
              <button
                type="button"
                onClick={toggleAll}
                aria-pressed={allAccessories}
                className={[
                  'group relative flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition',
                  allAccessories
                    ? 'border-brand-accent bg-brand-accent/5 shadow-[0_0_0_4px_rgba(61,157,255,0.15)]'
                    : 'border-border bg-card hover:border-foreground/20',
                ].join(' ')}
              >
                <CheckSquare checked={allAccessories} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">
                      {t('droneShop.accessoryAll')}
                    </span>
                    <span className="rounded-full bg-brand-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-accent">
                      ALL
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {t('droneShop.accessoryAllDesc')}
                  </p>
                  <p className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(ACCESSORY_PACK_PRICE)}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground line-through">
                      {formatPrice(6 * ACCESSORY_PRICE + BOX_PRICE)}
                    </span>
                  </p>
                </div>
              </button>

              {/* Individual accessories */}
              <div
                className={[
                  'mt-4 grid grid-cols-1 gap-2.5 transition sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-2',
                  allAccessories ? 'pointer-events-none opacity-50' : '',
                ].join(' ')}
              >
                {ACCESSORY_IDS.map((id) => {
                  const checked = !allAccessories && accessories[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        toggleAccessory(id);
                        setPreviewId(id);
                      }}
                      onMouseEnter={() => setPreviewId(id)}
                      onMouseLeave={() => setPreviewId(null)}
                      onFocus={() => setPreviewId(id)}
                      onBlur={() => setPreviewId(null)}
                      disabled={allAccessories}
                      aria-pressed={checked}
                      className={[
                        'flex h-full items-start gap-3 rounded-xl border-2 p-3 text-left transition',
                        checked
                          ? 'border-brand-accent bg-brand-accent/5'
                          : 'border-border bg-card hover:border-foreground/20',
                      ].join(' ')}
                    >
                      <CheckSquare checked={checked} small />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-tight text-foreground break-words">
                          {t(`droneShop.accessories.${id}`)}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span
                            className={[
                              'rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1',
                              MATERIAL_COLORS[ACCESSORY_MATERIAL[id]],
                            ].join(' ')}
                          >
                            {ACCESSORY_MATERIAL[id]}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-gray-900 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/80" aria-hidden />
                            {t('droneShop.colorBlack')}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs font-semibold text-foreground">
                          {formatPrice(id === 'box' ? BOX_PRICE : ACCESSORY_PRICE)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Order summary ──────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-border">
              <div className="bg-brand-blue px-6 py-5 text-white">
                <h2 className="text-lg font-bold">{t('droneShop.orderSummary')}</h2>
              </div>
              <div className="p-6">
                {cartIsEmpty ? (
                  <p className="text-sm text-muted-foreground">
                    {t('droneShop.emptyCart')}
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {bundle && (
                      <OrderLine
                        name={(() => {
                          const title = t(`droneShop.bundles.${bundle}.title`);
                          if (bundle === 'drone') {
                            return `${title} · ${
                              radio === 'crossfire' ? 'TBS Crossfire' : 'ELRS'
                            }`;
                          }
                          if (bundle === 'frame') {
                            return `${title} · ${
                              motorSpacing === '9x9' ? '9×9 mm' : '12×12 mm'
                            }`;
                          }
                          return title;
                        })()}
                        price={BUNDLE_PRICES[bundle]}
                        placeholderLabel={t('droneShop.priceTbd')}
                      />
                    )}
                    {allAccessories && (
                      <OrderLine
                        name={t('droneShop.accessoryAll')}
                        price={ACCESSORY_PACK_PRICE}
                        placeholderLabel={t('droneShop.priceTbd')}
                      />
                    )}
                    {!allAccessories &&
                      normalAccessoryIds.map((id) => (
                        <OrderLine
                          key={id}
                          name={t(`droneShop.accessories.${id}`)}
                          price={ACCESSORY_PRICE}
                          placeholderLabel={t('droneShop.priceTbd')}
                        />
                      ))}
                    {!allAccessories && quantityDiscount > 0 && (
                      <OrderLine
                        name={t('droneShop.quantityDiscount', {
                          count: normalAccessoryIds.length,
                        })}
                        price={-quantityDiscount}
                        placeholderLabel={t('droneShop.priceTbd')}
                        muted
                      />
                    )}
                    {!allAccessories && boxSelected && (
                      <OrderLine
                        name={t('droneShop.accessories.box')}
                        price={BOX_PRICE}
                        placeholderLabel={t('droneShop.priceTbd')}
                      />
                    )}
                  </ul>
                )}

                <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {t('droneShop.total')}
                  </span>
                  <span className="text-2xl font-bold text-foreground">
                    {total.hasPlaceholder && total.sum === 0
                      ? '—'
                      : total.hasPlaceholder
                        ? `${formatPrice(total.sum)} +`
                        : formatPrice(total.sum)}
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={cartIsEmpty}
                  size="lg"
                  className="mt-6 w-full bg-brand-accent py-6 text-base font-semibold text-white hover:bg-brand-accent/90"
                >
                  {t('droneShop.orderOnWhatsApp')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  {t('droneShop.orderDisclaimer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function BundleCard({
  active,
  onToggle,
  title,
  description,
  price,
  icon,
  highlight,
  children,
  index,
}: {
  active: boolean;
  onToggle: () => void;
  title: string;
  description: string;
  price: number | null;
  icon: React.ReactNode;
  highlight?: boolean;
  children?: React.ReactNode;
  index: number;
}) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={[
        'relative flex flex-col rounded-2xl bg-card p-6 ring-1 transition',
        active
          ? 'ring-2 ring-brand-accent shadow-[0_0_0_4px_rgba(61,157,255,0.15)]'
          : 'ring-border hover:ring-foreground/20 shadow-sm',
      ].join(' ')}
    >
      {highlight && (
        <span className="absolute -top-3 left-6 rounded-full bg-brand-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
          ★
        </span>
      )}
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-brand-blue">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {children}

      <div className="mt-auto pt-6">
        <p className="text-xl font-bold text-foreground">
          {price === null ? (
            <span className="text-sm font-semibold text-muted-foreground">
              {t('droneShop.priceTbd')}
            </span>
          ) : (
            formatPrice(price)
          )}
        </p>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={active}
          className={[
            'mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition',
            active
              ? 'bg-brand-blue text-white hover:bg-brand-blue/90'
              : 'bg-brand-accent text-white hover:bg-brand-accent/90',
          ].join(' ')}
        >
          {active ? (
            <>
              <Check className="h-4 w-4" />
              {t('droneShop.added')}
            </>
          ) : (
            t('droneShop.addToCart')
          )}
        </button>
      </div>
    </motion.div>
  );
}

function RadioChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'rounded-lg border-2 px-3 py-2 text-xs font-bold transition',
        selected
          ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
          : 'border-border bg-card text-muted-foreground hover:border-foreground/20',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function CheckSquare({
  checked,
  small,
}: {
  checked: boolean;
  small?: boolean;
}) {
  const size = small ? 'h-5 w-5' : 'h-6 w-6';
  return (
    <span
      aria-hidden
      className={[
        'mt-0.5 inline-flex shrink-0 items-center justify-center rounded-md border-2 transition',
        size,
        checked
          ? 'border-brand-accent bg-brand-accent text-white'
          : 'border-border bg-card',
      ].join(' ')}
    >
      {checked && <Check className={small ? 'h-3 w-3' : 'h-4 w-4'} strokeWidth={3} />}
    </span>
  );
}

function OrderLine({
  name,
  price,
  placeholderLabel,
  muted,
}: {
  name: string;
  price: number | null;
  placeholderLabel: string;
  muted?: boolean;
}) {
  const isNegative = typeof price === 'number' && price < 0;
  return (
    <li
      className={[
        'flex items-center justify-between py-3',
        muted ? 'text-emerald-700' : '',
      ].join(' ')}
    >
      <span
        className={[
          'text-sm',
          muted ? 'font-medium text-emerald-700' : 'text-foreground/80',
        ].join(' ')}
      >
        {name}
      </span>
      <span
        className={[
          'text-sm font-semibold',
          muted || isNegative ? 'text-emerald-700' : 'text-foreground',
        ].join(' ')}
      >
        {price === null ? (
          <span className="text-muted-foreground">{placeholderLabel}</span>
        ) : isNegative ? (
          `- ${formatPrice(Math.abs(price))}`
        ) : (
          formatPrice(price)
        )}
      </span>
    </li>
  );
}

export default DroneShop;
