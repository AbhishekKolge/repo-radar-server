export const currentTime = (): Date => {
  return new Date();
};

export const checkTimeExpired = (timeArg: string | number | Date): boolean => {
  const minute = 60000;
  return new Date(timeArg).getTime() - minute < Date.now();
};

export const getCodeExpirationTimeOffset = (): Date => {
  return new Date(Date.now() + 1000 * 60 * 10);
};

export const formattedUTCTime = (timeArg: string | Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    timeZone: 'UTC',
  };
  return new Date(timeArg).toLocaleDateString(undefined, options);
};

export const formateTimeToIso = (timeArg: string | Date): string => {
  const date = new Date(timeArg);
  return date.toISOString();
};
