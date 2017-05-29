/* @flow */
import { connect } from 'react-redux';
import Teams from './presenter';
import { fetchTeams, createTeam } from './reducer';

const mapStateToProps = (state) => {
  const { auth, teams } = state;

  return {
    isAuthenticated: auth.isAuthenticated,
    teams: teams.teams,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  fetchTeams: () => dispatch(fetchTeams()),
  createTeam: (team) => dispatch(createTeam(team)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Teams);
