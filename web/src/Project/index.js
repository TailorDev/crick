/* @flow */
import { connect } from 'react-redux';
import Project from './presenter';
import { fetchFrames } from './reducer';
import type { Action } from '../types';

const mapStateToProps = (state) => {
  const { frames } = state;

  return {
    frames: frames.frames,
    project: frames.project,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  fetchFrames: (id: string) => dispatch(fetchFrames(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Project);
