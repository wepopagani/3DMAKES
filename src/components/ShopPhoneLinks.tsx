import { Fragment } from 'react';
import { SHOP_PHONE_CONTACTS } from '@/constants/shopPhones';
import { cn } from '@/lib/utils';

type ShopPhoneLinksProps = {
  className?: string;
  linkClassName?: string;
  nameClassName?: string;
  /** true = due righe allineate; false = sulla stessa riga */
  stacked?: boolean;
  inlineSeparator?: string;
  onTelClick?: () => void;
};

export function ShopPhoneLinks({
  className,
  linkClassName,
  nameClassName,
  stacked = true,
  inlineSeparator = '·',
  onTelClick,
}: ShopPhoneLinksProps) {
  const rows = SHOP_PHONE_CONTACTS.map((c, idx) => (
    <Fragment key={c.telE164}>
      {!stacked && idx > 0 ? (
        <span className="select-none px-1.5 text-current/40" aria-hidden>
          {inlineSeparator}
        </span>
      ) : null}
      <span className={cn('inline-flex items-baseline', stacked ? 'gap-3' : 'gap-2')}>
        <span className={cn(stacked && 'w-16 shrink-0', nameClassName)}>{c.name}</span>
        <a
          href={`tel:${c.telE164}`}
          className={cn('whitespace-nowrap tabular-nums tracking-wide', linkClassName)}
          onClick={onTelClick}
        >
          {c.displayLocal}
        </a>
      </span>
    </Fragment>
  ));

  if (stacked) {
    return (
      <span className={cn('inline-flex flex-col items-start gap-1', className)}>{rows}</span>
    );
  }

  return (
    <span className={cn('inline-flex flex-wrap items-baseline', className)}>{rows}</span>
  );
}
