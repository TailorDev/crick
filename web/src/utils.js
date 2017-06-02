/* @flow */
import moment from 'moment';
import type { TagReport } from './types';

export const prettyDuration = (duration: number): string => {
  const d = moment.duration(duration);
  const hours = Math.floor(d.asHours());
  const minutes = Math.floor(d.subtract(hours, 'hours').asMinutes());

  let durationStr = hours > 0 ? `${hours} hours ` : '';
  durationStr += minutes > 0 ? `${minutes} min` : '';

  return durationStr;
};

export const sortByDuration = (t1: TagReport, t2: TagReport): number => {
  if (t1.duration === t2.duration) return 0;
  return t1.duration > t2.duration ? -1 : 1;
};
