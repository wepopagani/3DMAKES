/** Numeri operativi 3DMAKES: link tel con +41 senza zero iniziale (E.164). */
export const SHOP_PHONE_CONTACTS = [
  {
    name: 'Marco',
    telE164: '+41762660396',
    displayLocal: '076 266 03 96',
    waDigits: '41762660396',
  },
  {
    name: 'Matteo',
    telE164: '+41767027821',
    displayLocal: '076 702 78 21',
    waDigits: '41767027821',
  },
] as const;

export type ShopPhoneContact = (typeof SHOP_PHONE_CONTACTS)[number];

/** WhatsApp principale (Marco); stesso comportamento precedente sul sito. */
export const SHOP_PRIMARY_WA_DIGITS = SHOP_PHONE_CONTACTS[0].waDigits;

/** Frammento HTML per email (righe nominate con link tel). */
export function shopPhonesEmailHtmlFragments(): string {
  return SHOP_PHONE_CONTACTS.map(
    (c) =>
      `${c.name}: <a href="tel:${c.telE164}">${c.displayLocal}</a>`
  ).join('<br>');
}
