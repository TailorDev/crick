/* @flow */
import { combineReducers } from 'redux';

import auth from '../Auth/reducer';
import projects from '../Projects/reducer';

export default combineReducers({
  auth,
  projects,
});
