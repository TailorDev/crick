/* @flow */
import { combineReducers } from 'redux';

import auth from '../Auth/reducer';
import projects from '../Projects/reducer';
import projectReport from '../ProjectReport/reducer';
import teams from '../Teams/reducer';
import errors from '../Errors/reducer';
import teamReport from '../TeamReport/reducer';

export default combineReducers({
  auth,
  projects,
  projectReport,
  teams,
  errors,
  teamReport,
});
