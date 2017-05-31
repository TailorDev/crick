/* @flow */
import { connect } from 'react-redux';
import Projects from './presenter';
import { fetchProjects } from './reducer';
import type {
  Action,
} from '../types';

const mapStateToProps = (state) => {
  const { auth, projects } = state;

  return {
    token: 'xyw',
    isAuthenticated: auth.isAuthenticated,
    projects: projects.projects,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  fetchProjects: () => dispatch(fetchProjects()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
