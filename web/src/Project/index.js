/* @flow */
import { connect } from 'react-redux';
import Project from './presenter';
import { compileReport, fetchFrames } from './reducer';
import type { Action } from '../types';

const mapStateToProps = (state) => {
  const { frames } = state;

  return {
    frames: frames.frames,
    project: frames.project,
    report: frames.report,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  fetchFrames: (id: string) => dispatch(fetchFrames(id)),
  compileReport: (frames: Array<Object>) => dispatch(compileReport(frames)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
