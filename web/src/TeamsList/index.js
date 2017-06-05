/* @flow */
import { connect } from 'react-redux';
import TeamsList from './presenter';
import { selectTeamsState, fetchTeams } from '../Teams/reducer';

const mapStateToProps = state => {
  const teams = selectTeamsState(state);

  return {
    teams: teams.teams,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  fetchTeams: () => dispatch(fetchTeams()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamsList);
