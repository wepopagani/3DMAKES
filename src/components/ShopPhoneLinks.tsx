import { useTranslation } from 'react-i18next';
import { formatShopPhone, SHOP_PHONE_CONTACTS, SHOP_PHONE_ROLE_LABELS } from '@/constants/shopPhones';
import { cn } from '@/lib/utils';

type ShopPhoneLinksProps = {
  className?: string;
  linkClassName?: string;
  nameClassName?: string;
  /** Dispone i gruppi di contatti in colonna oppure li affianca quando c'è spazio. */
  stacked?: boolean;
  onTelClick?: () => void;
};

export function ShopPhoneLinks({
  className,
  linkClassName,
  nameClassName,
  stacked = true,
  onTelClick,
}: ShopPhoneLinksProps) {
  const { t } = useTranslation();

  return (
    <span className={cn('inline-flex max-w-full gap-x-4 gap-y-2', stacked ? 'flex-col' : 'flex-wrap', className)}>
      {(['sales', 'technical'] as const).map((role) => (
        <span key={role} className="inline-flex max-w-full flex-col gap-0.5">
          <span className="text-xs font-semibold leading-normal">
            {t(`contact.phoneRoles.${role}`, { defaultValue: SHOP_PHONE_ROLE_LABELS[role] })}
          </span>
          <span className={cn('inline-flex gap-x-4 gap-y-0.5', stacked ? 'flex-col' : 'flex-wrap')}>
            {SHOP_PHONE_CONTACTS.filter((contact) => contact.role === role).map((contact) => (
              <span key={contact.telE164} className="inline-flex flex-wrap items-baseline gap-x-2">
                <span className={nameClassName}>{contact.name}</span>
                <a
                  href={`tel:${contact.telE164}`}
                  className={cn('whitespace-nowrap tabular-nums', linkClassName)}
                  onClick={onTelClick}
                >
                  {formatShopPhone(contact.telE164)}
                </a>
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
