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
import { Link } from 'react-router-dom';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';
import ChallengeConfirmationDialog from '../Common/ChallengeConfirmationDialog';
import type { User, Team } from '../types';

class List extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      teamToDelete: null,
    };

    (this: any).onCancelDeletion = this.onCancelDeletion.bind(this);
    (this: any).onConfirmDeletion = this.onConfirmDeletion.bind(this);
  }

  state: {
    teamToDelete: ?Team,
  };

  props: {
    userId: string,
    teams: Array<Team>,
    onDelete: Function,
  };

  onDelete(team: Team) {
    this.setState({ teamToDelete: team });
  }

  onCancelDeletion() {
    this.setState({ teamToDelete: null });
  }

  onConfirmDeletion() {
    const { teamToDelete } = this.state;

    this.setState({ teamToDelete: null }, () => {
      this.props.onDelete(teamToDelete);
    });
  }

  renderUser(user: User) {
    return (
      <Avatar
        key={user.id}
        title={user.login}
        src={user.avatar_url}
        style={{ marginRight: '5px' }}
      />
    );
  }

  renderConfirmation() {
    if (!this.state.teamToDelete) {
      return;
    }

    const challenge = this.state.teamToDelete.name;

    return (
      <ChallengeConfirmationDialog
        challenge={challenge}
        onCancel={this.onCancelDeletion}
        onConfirm={this.onConfirmDeletion}
      >
        <p>
          Deleting a team is a non-recoverable operation. Please type
          &nbsp;<strong>{challenge}</strong>&nbsp;
          to confirm the deletion of your team.
        </p>
      </ChallengeConfirmationDialog>
    );
  }

  renderActions(team: Team) {
    if (team.owner_id !== this.props.userId) {
      return null;
    }

    return (
      <span>
        <Link to={`/teams/${team.id}/edit`}>
          <EditIcon title="Edit this team" />
        </Link>
        <IconButton onTouchTap={this.onDelete.bind(this, team)}>
          <DeleteIcon title="Delete this team" />
        </IconButton>
      </span>
    );
  }

  render() {
    return (
      <div>
        {this.renderConfirmation()}

        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Projects</TableHeaderColumn>
              <TableHeaderColumn>Members</TableHeaderColumn>
              <TableHeaderColumn>Actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} stripedRows={false}>
            {this.props.teams.map(team =>
              <TableRow key={team.id}>
                <TableRowColumn>{team.name}</TableRowColumn>
                <TableRowColumn>{team.projects.join(', ')}</TableRowColumn>
                <TableRowColumn>
                  {team.users.map(u => this.renderUser(u))}
                </TableRowColumn>
                <TableRowColumn>
                  {this.renderActions(team)}
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}
export default List;
