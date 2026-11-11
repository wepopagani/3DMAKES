const commercialContact = {
  name: 'Francesco',
  role: 'sales',
  telE164: '+41764778907',
} as const;

export const SHOP_PHONE_CONTACTS = [
  commercialContact,
  {
    name: 'Marco',
    role: 'technical',
    telE164: '+41762660396',
  },
  {
    name: 'Matteo',
    role: 'technical',
    telE164: '+41767027821',
  },
] as const;

export type ShopPhoneContact = (typeof SHOP_PHONE_CONTACTS)[number];

export const SHOP_PHONE_ROLE_LABELS = {
  sales: 'Commerciale',
  technical: 'Tecnico',
} as const;

export const SHOP_PRIMARY_WA_DIGITS = commercialContact.telE164.slice(1);

export function formatShopPhone(telE164: ShopPhoneContact['telE164']): string {
  return telE164.replace(/^\+41(\d{2})(\d{3})(\d{2})(\d{2})$/, '+41 $1 $2 $3 $4');
}

/** Frammento HTML per email (righe nominate con link tel). */
export function shopPhonesEmailHtmlFragments(): string {
  return SHOP_PHONE_CONTACTS.map(
    (contact) =>
      `${contact.name} (${SHOP_PHONE_ROLE_LABELS[contact.role]}): <a href="tel:${contact.telE164}">${formatShopPhone(contact.telE164)}</a>`
  ).join('<br>');
}
