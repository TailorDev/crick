/* @flow */
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
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
  }

  props: {
    isAuthenticated: boolean,
    teams: Array<Team>,
    fetchTeams: Function,
    createTeam: Function,
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
      });
    }
  }

  addTeam(team: NewTeam) {
    this.setState({ dialogIsOpen: false }, () => {
      this.props.createTeam(team);
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
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.onCloseDialog}
      />,
    ];

    return (
      <div>
        <h2>Team management</h2>

        {this.props.teams.length > 0 ? (
          <List teams={this.props.teams} />
        ) : <Empty /> }

        <Dialog
          title="Add a new team"
          actions={actions}
          open={this.state.dialogIsOpen}
          onRequestClose={this.onCloseDialog}
        >
          <Form
            onSave={this.addTeam}
            suggestedUsers={this.props.suggestedUsers}
            autoCompleteUsers={this.props.autoCompleteUsers}
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
