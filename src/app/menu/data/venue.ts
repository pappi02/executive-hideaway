import { businessContact } from '@/lib/site-config';

/** Menu-specific venue details; contact details come from the site-wide config. */
export const venue = {
  name: 'Executive Hideaway',
  descriptor: 'Resort & Spa',
  monogram: 'EH',
  city: 'Nairobi',
  country: 'Kenya',
  address: '275 Nyeri Close, Kileleshwa, Nairobi',
  phone: businessContact.primaryPhoneHref.replace('tel:', ''),
  phoneDisplay: businessContact.primaryPhone,
  email: businessContact.email,
  currency: 'KSh',
  established: 'Est. Nairobi',
  hours: [
    { label: 'Breakfast', value: '07:00 — 11:00' },
    { label: 'Kitchen', value: '11:00 — 22:30' },
    { label: 'The Bar', value: '11:00 — late' },
    { label: 'Spa & Barber', value: '09:00 — 22:00, by appointment' },
  ],
} as const;

export const whatsappLink = businessContact.whatsappUrl;
