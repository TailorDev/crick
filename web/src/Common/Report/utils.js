/* @flow */
import 'url-search-params-polyfill';
import moment from 'moment';

export const getFromDateFromQueryParams = (): moment => {
  const queryParams = new URLSearchParams(window.location.search);

  if (queryParams.has('from')) {
    return moment(queryParams.get('from'));
  }

  return moment().subtract(7, 'days');
};

export const getToDateFromQueryParams = (): moment => {
  const queryParams = new URLSearchParams(window.location.search);

  if (queryParams.has('to')) {
    return moment(queryParams.get('to'));
  }

  return moment(); // now
};

export const getTagsFromQueryParams = (): Array<string> => {
  const queryParams = new URLSearchParams(window.location.search);

  if (!queryParams.has('tags')) {
    return [];
  }

  return queryParams.get('tags').split(',');
};
