/* @flow */
import { connect } from 'react-redux';
import Teams from './presenter';
import {
  fetchTeams,
  createTeam,
  autoCompleteUsers,
} from './reducer';

const mapStateToProps = (state) => {
  const { auth, teams } = state;

  return {
    isAuthenticated: auth.isAuthenticated,
    teams: teams.teams,
    suggestedUsers: teams.suggestedUsers,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  fetchTeams: () => dispatch(fetchTeams()),
  createTeam: (team) => dispatch(createTeam(team)),
  autoCompleteUsers: (input) => dispatch(autoCompleteUsers(input)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
