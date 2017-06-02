/* @flow */
import moment from 'moment';


export const prettyDuration = (duration: number): string => {

  const d = moment.duration(duration);
  const hours = Math.floor(d.asHours());
  const minutes = Math.floor(d.subtract(hours, 'hours').asMinutes());

  let durationStr = hours > 0 ? `${hours} hours ` : '';
  durationStr += minutes > 0 ? `${minutes} min` : '';

  return durationStr;
}
