import { useSyncExternalStore } from 'react';

/** The resort is in Nairobi, so greetings follow East Africa Time, not the viewer's clock. */
const EAT_TIME_ZONE = 'Africa/Nairobi';

const hourFormat = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  hourCycle: 'h23',
  timeZone: EAT_TIME_ZONE,
});

export function eatHour(date: Date = new Date()): number {
  return Number(hourFormat.format(date));
}

/** 05:00–11:59 morning, 12:00–16:59 afternoon, otherwise evening (EAT). */
export function eatGreeting(date: Date = new Date()): string {
  const hour = eatHour(date);
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

/** Current EAT greeting; re-checks every minute so an open menu rolls over on time. */
export function useEatGreeting(): string {
  return useSyncExternalStore(subscribe, () => eatGreeting(), () => eatGreeting());
}
