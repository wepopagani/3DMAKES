import { Fragment } from 'react';
import { SHOP_PHONE_CONTACTS } from '@/constants/shopPhones';
import { cn } from '@/lib/utils';

type ShopPhoneLinksProps = {
  className?: string;
  linkClassName?: string;
  nameClassName?: string;
  /** true = righe verticali; false = sulla stessa riga separati da sep */
  stacked?: boolean;
  inlineSeparator?: string;
  onTelClick?: () => void;
};

export function ShopPhoneLinks({
  className,
  linkClassName,
  nameClassName,
  stacked = true,
  inlineSeparator = ' · ',
  onTelClick,
}: ShopPhoneLinksProps) {
  const items = SHOP_PHONE_CONTACTS.map((c, idx) => (
    <Fragment key={c.telE164}>
      {!stacked && idx > 0 ? inlineSeparator : null}
      <span className={cn(!stacked && 'whitespace-nowrap')}>
        <span className={nameClassName}>{c.name}: </span>
        <a
          href={`tel:${c.telE164}`}
          className={linkClassName}
          onClick={onTelClick}
        >
          {c.displayLocal}
        </a>
      </span>
    </Fragment>
  ));

  if (stacked) {
    return (
      <span className={cn('flex flex-col gap-1', className)}>{items}</span>
    );
  }

  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-1 gap-y-0.5', className)}>
      {items}
    </span>
  );
}
