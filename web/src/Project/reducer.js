/* @flow */
import { CALL_API } from 'redux-api-middleware';
import moment from 'moment';
import { LOGOUT } from '../Auth/reducer';
import { API_ERROR } from '../Errors/reducer';
import type {
  Action, Frame, Report,
} from '../types';

// State
type State = {
  frames: Array<Object>,
  from: moment,
  to: moment,
  tags: Array<string>,
  project: string,
  report: Report,
};

const from = moment().subtract(7, 'days');
const to = moment();  // now
const dateFormat = 'YYYY-MM-DD';

const initialState: State = {
  frames: [],
  from: from,
  to: to,
  tags: [],
  project: '',
  report: {
    total: 0,
    tagReports: [],
  },
};

// Actions
const FETCH_REQUEST = 'crick/frames/FETCH_REQUEST';
const FETCH_SUCCESS = 'crick/frames/FETCH_SUCCESS';
const REPORT_COMPILED = 'crick/frames/COMPILE_REPORT';
const UPDATE_DATE_SPAN = 'crick/frames/UPDATE_DATE_SPAN';

export const fetchFrames = (id: string, from: moment, to: moment, limit: number): Action => {

  const endpoint = `${process.env.REACT_APP_API_HOST || ''}/frames`;
  let query = id ? `?projectId=${id}` : '?';
  query += from ? `&from=${from.format(dateFormat)}` : '';
  query += to ? `&to=${to.format(dateFormat)}` : '';
  query += limit ? `&limit=${limit}` : '';

  return {
    [CALL_API]: {
      endpoint: endpoint + query,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      types: [FETCH_REQUEST, FETCH_SUCCESS, API_ERROR],
    },
  };
};

export const compileReport = (frames: Array<Frame>): Action => {
  const tmp = frames.reduce((r, frame) => {
    const duration = moment(frame.end_at).diff(moment(frame.start_at));
    r.total += duration;
    frame.tags.forEach((t) => {
      let d = r.tagReports.has(t) ? r.tagReports.get(t) : 0;
      d += duration;
      r.tagReports.set(t, d);
    });
    return r
  }, {
    'total': 0,
    'tagReports': new Map()
  });

  // An array is easier to manipulate
  const report = {
    'total': tmp.total,
    'tagReports': Array.from(tmp.tagReports).map((tagReport) => {
      return {
        'tag': tagReport[0],
        'duration': tagReport[1],
      };
    }),
  };

  // Sort tags by duration
  report.tagReports.sort((t1, t2) => {
    if (t1[1] === t2[1])
      return 0;
    return t1[1] > t2[1] ? -1 : 1;
  })

  return {
    'type': REPORT_COMPILED,
    'report': report,
  };
}

export const updateDateSpan = (from: moment, to: moment): Action => {
  return {
    'type': UPDATE_DATE_SPAN,
    'from': from,
    'to': to,
  };
}

// Reducer
export default function reducer(
  state: State = initialState,
  action: Action = {}
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        frames: action.payload.frames,
        project: action.payload.meta.project.name,
      };

    case REPORT_COMPILED:
      return {
        ...state,
        report: action.report,
      }

    case UPDATE_DATE_SPAN:
      return {
        ...state,
        from: action.from,
        to: action.to,
      }

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
