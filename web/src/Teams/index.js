/* @flow */
import { connect } from 'react-redux';
import Teams from './presenter';
import { selectAuthState } from '../Auth/reducer';
import {
  fetchTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  autoCompleteUsers,
  selectTeamsState,
} from './reducer';
import type { Team, NewTeam } from '../types';

const mapStateToProps = state => {
  const teams = selectTeamsState(state);
  const auth = selectAuthState(state);

  return {
    userId: auth.id,
    teams: teams.teams,
    suggestedUsers: teams.suggestedUsers,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  fetchTeams: () => dispatch(fetchTeams()),
  createTeam: (team: NewTeam) => dispatch(createTeam(team)),
  autoCompleteUsers: input => dispatch(autoCompleteUsers(input)),
  updateTeam: (team: Team) => dispatch(updateTeam(team)),
  deleteTeam: (team: Team) => dispatch(deleteTeam(team)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
