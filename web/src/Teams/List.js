/* @flow */
import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import type { Team } from '../types';

class List extends React.Component {

  props: {
    teams: Array<Team>,
  };

  render() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Projects</TableHeaderColumn>
            <TableHeaderColumn>Members</TableHeaderColumn>
          </TableRow>
        </TableHeader>
      <TableBody>
        {this.props.teams.map(team => (
          <TableRow key={team.id}>
            <TableRowColumn>{team.name}</TableRowColumn>
            <TableRowColumn>{team.projects.join(', ')}</TableRowColumn>
            <TableRowColumn>{team.users.map(u => u.login).join(', ')}</TableRowColumn>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    );
  }
}

export default List;
