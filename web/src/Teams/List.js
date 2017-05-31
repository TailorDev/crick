/* @flow */
import React from 'react';
import Avatar from 'material-ui/Avatar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import type { User, Team } from '../types';

class List extends React.Component {

  props: {
    teams: Array<Team>,
  };

  renderUser(user: User) {
    return (
      <Avatar key={user.id} title={user.login} src={user.avatar_url} />
    );
  }

  render() {
    return (
      <Table selectable={false}>
        <TableHeader
          adjustForCheckbox={false}
          displaySelectAll={false}
        >
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Projects</TableHeaderColumn>
            <TableHeaderColumn>Members</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          stripedRows={false}
        >
        {this.props.teams.map(team => (
          <TableRow key={team.id}>
            <TableRowColumn>{team.name}</TableRowColumn>
            <TableRowColumn>{team.projects.join(', ')}</TableRowColumn>
            <TableRowColumn>
              {team.users.map(u => this.renderUser(u))}
            </TableRowColumn>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    );
  }
}
export default List;
