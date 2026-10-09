/**
 * Kenyan mobile numbers: 07xx / 01xx locally, or +254 / 254 followed by 7xx / 1xx.
 * Shared by the booking and accommodation request forms (client and server).
 */
const KENYAN_MOBILE = /^(?:\+?254|0)[17]\d{8}$/;

export function normalizePhone(value: string) {
  return value.replace(/[\s()-]/g, "");
}

export function isKenyanMobile(value: string) {
  return KENYAN_MOBILE.test(normalizePhone(value));
}
