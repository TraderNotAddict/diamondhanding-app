import { Duration } from 'luxon';

export const renderDuration = (durationInSeconds: number): string => {
  let remainder = durationInSeconds;
  const numDays = Math.floor(remainder / 86400);
  remainder = remainder % (numDays * 86400);
  const numHours = Math.floor(remainder / 3600);
  remainder = remainder % (numHours * 3600);
  const numMinutes = Math.floor(remainder / 60);
  remainder = remainder % (numMinutes * 60);
  return Duration.fromObject({
    days: numDays > 0 ? numDays : undefined,
    hours: numHours > 0 ? numHours : undefined,
    minutes: numMinutes > 0 ? numMinutes : undefined,
    seconds: remainder > 0 ? remainder : undefined,
  }).toHuman({
    unitDisplay: 'short',
    listStyle: 'narrow',
  });
};
