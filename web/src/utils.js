/* @flow */
import moment from 'moment';
import type { Project, TagReport } from './types';

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

export const sortByName = (p1: Project, p2: Project): number => {
  if (p1.name === p2.name) return 0;
  return p1.name > p2.name ? 1 : -1;
};

export const prettyDiffDate = (d1: Date, d2: Date) => {
  return moment.utc(moment(d2).diff(moment(d1))).format('HH:mm:ss');
};
