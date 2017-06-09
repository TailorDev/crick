/* @flow */
import { connect } from 'react-redux';
import moment from 'moment';
import TeamReport from './presenter';
import {
  compileReport,
  fetchFrames,
  updateDateSpan,
  updateTags,
  updateTeamData,
  // selectors
  selectTeamReportState,
} from './reducer';
import type { State, Action, Frame } from '../types';

const mapStateToProps = (state: State) => {
  const team = selectTeamReportState(state);

  return {
    team: team.team,
    frames: team.frames,
    report: team.report,
    from: team.from,
    to: team.to,
    tags: team.tags,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  fetchData: (
    id: string,
    from: moment,
    to: moment,
    tags: Array<string>,
    limit: number
  ) => {
    dispatch(fetchFrames(id, from, to, tags, limit));
  },
  compileReport: (frames: Array<Frame>) => dispatch(compileReport(frames)),
  updateDateSpan: (from: moment, to: moment) => {
    dispatch(updateDateSpan(from, to));
  },
  updateTags: (tags: Array<string>) => dispatch(updateTags(tags)),
  setData: (from: moment, to: moment, tags: Array<string>) => {
    dispatch(updateTeamData(from, to, tags));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamReport);
