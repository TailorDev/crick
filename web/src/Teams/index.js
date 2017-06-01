/* @flow */
import { connect } from 'react-redux';
import Teams from './presenter';
import {
  fetchTeams,
  createTeam,
  updateTeam,
  autoCompleteUsers,
} from './reducer';
import type { Team, NewTeam } from '../types';

const mapStateToProps = (state) => {
  const { auth, teams } = state;

  return {
    userId: auth.id,
    teams: teams.teams,
    suggestedUsers: teams.suggestedUsers,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  fetchTeams: () => dispatch(fetchTeams()),
  createTeam: (team: NewTeam) => dispatch(createTeam(team)),
  autoCompleteUsers: (input) => dispatch(autoCompleteUsers(input)),
  updateTeam: (team: Team) => dispatch(updateTeam(team)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
