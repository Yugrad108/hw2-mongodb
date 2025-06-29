export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

const toMilliseconds = ({ days = 0, hours = 0, minutes = 0, seconds = 0 }) =>
  1000 * (seconds + 60 * (minutes + 60 * (hours + 24 * days)));

export const FIFTEEN_MINUTES = toMilliseconds({ minutes: 15 });
export const ONE_DAY = toMilliseconds({ days: 1 });
