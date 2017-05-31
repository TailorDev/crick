/* @flow */
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Link } from 'react-router-dom';
import type { User, Team, NewTeam } from '../types';
import Form from './Form';
import List from './List';
import Empty from './Empty';

class Teams extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      editTeam: null,
      dialogIsOpen: false,
    };

    (this: any).addTeam = this.addTeam.bind(this);
    (this: any).onOpenDialog = this.onOpenDialog.bind(this);
    (this: any).onCloseDialog = this.onCloseDialog.bind(this);
    (this: any).updateTeam = this.updateTeam.bind(this);
  }

  props: {
    isAuthenticated: boolean,
    teams: Array<Team>,
    fetchTeams: Function,
    createTeam: Function,
    updateTeam: Function,
    // for the form
    suggestedUsers: Array<User>,
    autoCompleteUsers: Function,
    // routing
    match: {
      params: {
        id: string,
      },
    },
  };

  state: {
    editTeam: ?Team,
    dialogIsOpen: boolean,
  };

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.props.fetchTeams();
  }

  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.match.params.id) {
      this.setState({
        editTeam: nextProps.teams.find(t => nextProps.match.params.id === t.id),
        dialogIsOpen: true,
      });
    }
  }

  addTeam(team: NewTeam) {
    this.setState({ dialogIsOpen: false }, () => {
      this.props.createTeam(team);
    });
  }

  updateTeam(team: Team) {
    this.setState({ dialogIsOpen: false }, () => {
      this.props.updateTeam(team);
    });
  }

  onOpenDialog() {
    this.setState({ dialogIsOpen: true });
  }

  onCloseDialog() {
    this.setState({ dialogIsOpen: false });
  }

  render() {
    const actions = [
      <Link to={`/teams`}>
        <FlatButton
          primary
          label="Cancel"
          onTouchTap={this.onCloseDialog}
        />
      </Link>,
    ];

    const { editTeam, dialogIsOpen } = this.state;

    return (
      <div>
        <h2>Teams</h2>

        {this.props.teams.length > 0 ? (
          <List teams={this.props.teams} />
        ) : <Empty /> }

        <Dialog
          title={editTeam ? `Edit "${editTeam.name}"` : 'Create a new team'}
          actions={actions}
          open={dialogIsOpen}
          onRequestClose={this.onCloseDialog}
        >
          <Form
            onCreate={this.addTeam}
            onUpdate={this.updateTeam}
            suggestedUsers={this.props.suggestedUsers}
            autoCompleteUsers={this.props.autoCompleteUsers}
            team={editTeam}
          />
        </Dialog>

        <FloatingActionButton
          style={{ position: 'fixed', bottom: 20, right: 20 }}
          onTouchTap={this.onOpenDialog}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

export default Teams;
