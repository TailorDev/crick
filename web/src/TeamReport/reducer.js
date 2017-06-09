/* @flow */
import { CALL_API } from 'redux-api-middleware';
import moment from 'moment';
import { LOGOUT } from '../Auth/reducer';
import { API_REQUEST, API_ERROR } from '../Errors/reducer';
import type {
  GetState,
  Dispatch,
  State,
  Team,
  ThunkAction,
  Action,
  Frame,
  Report,
} from '../types';
import { sortByDuration } from '../utils';

// State
export type TeamReportState = {
  frames: Array<Frame>,
  from: moment,
  to: moment,
  tags: Array<string>,
  team: ?Team,
  report: Report,
};

const DATE_FORMAT = 'YYYY-MM-DD';
const initialState: TeamReportState = {
  frames: [],
  from: moment().subtract(7, 'days'),
  to: moment(),
  tags: [],
  team: null,
  report: {
    total: 0,
    tagReports: [],
  },
};

// Actions
const FETCH_SUCCESS = 'crick/teamReport/FETCH_SUCCESS';
const REPORT_COMPILED = 'crick/teamReport/COMPILE_REPORT';
const UPDATE_DATE_SPAN = 'crick/teamReport/UPDATE_DATE_SPAN';
const UPDATE_TAGS = 'crick/teamReport/UPDATE_TAGS';
const UPDATE_TEAM_DATA = 'crick/teamReport/UPDATE_TEAM_DATA';

export const fetchFrames = (
  id: string,
  from: moment,
  to: moment,
  tags: Array<string>,
  limit: number
): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    const endpoint = `${process.env.REACT_APP_API_HOST || ''}/frames`;
    const query = [
      `teamId=${id}`,
      `from=${from.format(DATE_FORMAT)}`,
      `to=${to.format(DATE_FORMAT)}`,
      `limit=${limit}`,
    ];

    if (tags.length > 0) {
      query.push(`tags=${tags.join(',')}`);
    }

    dispatch({
      [CALL_API]: {
        endpoint: `${endpoint}?${query.join('&')}`,
        method: 'GET',
        headers: { Accept: 'application/json' },
        types: [API_REQUEST, FETCH_SUCCESS, API_ERROR],
      },
    });
  };
};

export const compileReport = (frames: Array<Frame>): Action => {
  const tmp = frames.reduce(
    (r, frame) => {
      const duration = moment(frame.end_at).diff(moment(frame.start_at));

      r.total += duration;
      frame.tags.forEach(t => {
        let d = r.tagReports.has(t) ? r.tagReports.get(t) : 0;

        d += duration;
        r.tagReports.set(t, d);
      });

      return r;
    },
    {
      total: 0,
      tagReports: new Map(),
    }
  );

  // An array is easier to manipulate
  const report = {
    total: tmp.total,
    tagReports: Array.from(tmp.tagReports).map(tagReport => {
      return {
        tag: tagReport[0],
        duration: tagReport[1],
      };
    }),
  };

  // Sort tags by duration
  report.tagReports.sort(sortByDuration);

  return {
    type: REPORT_COMPILED,
    report,
  };
};

export const updateDateSpan = (from: moment, to: moment): Action => ({
  type: UPDATE_DATE_SPAN,
  from,
  to,
});

export const updateTags = (tags: Array<string>): Action => ({
  type: UPDATE_TAGS,
  tags,
});

export const updateTeamData = (from: moment, to: moment, tags: Array<string>): Action => ({
  type: UPDATE_TEAM_DATA, from, to, tags,
});

// selectors
export const selectTeamReportState = (state: State): TeamReportState => {
  return state.teamReport;
};

export const selectTeamId = (state: TeamReportState): ?string => {
  if (!state.team) {
    return null;
  }

  return state.team.id;
};

// Reducer
export default function reducer(
  state: TeamReportState = initialState,
  action: Action = {}
): TeamReportState {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        frames: action.payload.frames,
        team: action.payload.meta.team,
      };

    case REPORT_COMPILED:
      return {
        ...state,
        report: action.report,
      };

    case UPDATE_DATE_SPAN:
      return {
        ...state,
        from: action.from,
        to: action.to,
      };

    case UPDATE_TAGS:
      return {
        ...state,
        tags: action.tags,
      };

    case UPDATE_TEAM_DATA:
      return {
        ...state,
        from: action.from,
        to: action.to,
        tags: action.tags,
      };

    case LOGOUT:
      return initialState;

    default:
      return state;
  }
}
