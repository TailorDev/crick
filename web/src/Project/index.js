/* @flow */
import { connect } from 'react-redux';
import moment from 'moment';
import Project from './presenter';
import {
  compileReport,
  fetchFrames,
  updateDateSpan
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
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  fetchFrames: (id: string, from: moment, to: moment, limit: number) => dispatch(
    fetchFrames(id, from, to, limit)
  ),
  compileReport: (frames: Array<Frame>) => dispatch(compileReport(frames)),
  updateDateSpan: (from: moment, to: moment) => dispatch(updateDateSpan(from, to)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
