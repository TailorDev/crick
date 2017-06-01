/* @flow */
import { connect } from 'react-redux';
import moment from 'moment';
import Project from './presenter';
import {
  compileReport,
  fetchFrames,
  updateDateSpan,
  updateTags,
  fetchWorkloads,
} from './reducer';
import type { Action, Frame } from '../types';

const mapStateToProps = (state) => {
  const { frames } = state;

  return {
    frames: frames.frames,
    project: frames.project,
    report: frames.report,
    from: frames.from,
    to: frames.to,
    tags: frames.tags,
    workloads: frames.workloads,
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
    dispatch(fetchWorkloads(id));
  },
  compileReport: (frames: Array<Frame>) => dispatch(compileReport(frames)),
  updateDateSpan: (from: moment, to: moment) => dispatch(updateDateSpan(from, to)),
  updateTags: (tags: Array<string>) => dispatch(updateTags(tags)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
