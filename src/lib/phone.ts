/**
 * Kenyan mobile numbers: 07xx / 01xx locally, or +254 / 254 followed by 7xx / 1xx.
 * Guests from elsewhere enter an international number starting with +.
 * Shared by the booking and accommodation request forms (client and server).
 */
const KENYAN_MOBILE = /^(?:\+?254|0)[17]\d{8}$/;
const INTERNATIONAL = /^\+[1-9]\d{7,14}$/;

export function normalizePhone(value: string) {
  return value.replace(/[\s()-]/g, "");
}

export function isKenyanMobile(value: string) {
  return KENYAN_MOBILE.test(normalizePhone(value));
}

export function isValidPhone(value: string) {
  const phone = normalizePhone(value);
  return KENYAN_MOBILE.test(phone) || INTERNATIONAL.test(phone);
}
