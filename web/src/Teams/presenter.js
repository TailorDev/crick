/* @flow */
import React from 'react';
import type { Team } from '../types';
import Form from './Form';

class Teams extends React.Component {
  constructor(props: Object) {
    super(props);

    (this: any).addTeam = this.addTeam.bind(this);
  }

  props: {
    isAuthenticated: boolean,
    teams: Array<Team>,
    fetchTeams: Function,
    createTeam: Function,
  };

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.props.fetchTeams();
  }

  addTeam(team: Team) {
    this.props.createTeam(team);
  }

  render() {
    return (
      <div>
        <h2>Team management</h2>

        <h3>Your teams</h3>
        <ul>
        {this.props.teams.map(t => (
          <li key={t.id}>
            {t.name}
          </li>
        ))}
        </ul>

        <h3>Add a new team</h3>
        <Form onSave={this.addTeam} />
      </div>
    );
  }
}

export default Teams;
