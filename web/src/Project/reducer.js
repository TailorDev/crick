/* @flow */
import { CALL_API } from 'redux-api-middleware';
import moment from 'moment';
import { LOGOUT } from '../Auth/reducer';
import { API_ERROR } from '../Errors/reducer';
import type {
  Action, Report,
} from '../types';

// State
type State = {
  frames: Array<Object>,
  project: string,
  report: Report,
};

const initialState: State = {
  frames: [],
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

export const fetchFrames = (id: string): Action => {
  return {
    [CALL_API]: {
      endpoint: `${process.env.REACT_APP_API_HOST || ''}/frames?projectId=${id}`,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      types: [FETCH_REQUEST, FETCH_SUCCESS, API_ERROR],
    },
  };
};

export const compileReport = (frames: Array<Object>): Action => {
  const report = frames.reduce((r, frame) => {
    const duration = moment.utc(
      moment(frame.end_at).diff(moment(frame.start_at))
    );
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
  report.tagReports = Array.from(report.tagReports);

  // Sort tags by duration
  report.tagReports.sort((t1, t2) => {
    if (t1[1] === t2[1])
      return 0;
    return t1[1] > t2[1] ? -1 : 1;
  })

  return {
    'type': REPORT_COMPILED,
    'report': report
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

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
