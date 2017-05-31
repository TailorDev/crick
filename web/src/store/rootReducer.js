/* @flow */
import { combineReducers } from 'redux';

import auth from '../Auth/reducer';
import projects from '../Projects/reducer';
import frames from '../Project/reducer';
import teams from '../Teams/reducer';
import errors from '../Errors/reducer';

export default combineReducers({
  auth,
  projects,
  frames,
  teams,
  errors,
});
