/* @flow */
import React from 'react';
import Team from './Team';
import Loading from '../Common/Loading';
import type { Team as TeamType } from '../types';
import './index.css';

class TeamsList extends React.Component {
  props: {
    teams: Array<TeamType>,
    fetchTeams: Function,
  };

  componentDidMount() {
    this.props.fetchTeams();
  }

  render() {
    if (!this.props.teams) {
      return <Loading message="Loading your teams..." />;
    }

    if (this.props.teams.length === 0) {
      return null;
    }

    return (
      <div className="Teams">
        <h2>Teams</h2>

        <div className="Teams-list">
          {this.props.teams.map(p => <Team key={p.id} {...p} />)}
        </div>
      </div>
    );
  }
}

export default TeamsList;
