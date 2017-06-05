/* @flow */
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import type { RouterHistory, Location, Match } from 'react-router-dom';
import Loading from '../Common/Loading';
import type { User, Team, NewTeam } from '../types';
import Form from './Form';
import List from './List';
import Empty from './Empty';
import './index.css';

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
    userId: string,
    teams: ?Array<Team>,
    fetchTeams: Function,
    createTeam: Function,
    updateTeam: Function,
    deleteTeam: Function,
    // for the form
    suggestedUsers: Array<User>,
    autoCompleteUsers: Function,
    // routing
    history: RouterHistory,
    location: Location,
    match: Match,
  };

  state: {
    editTeam: ?Team,
    dialogIsOpen: boolean,
  };

  componentDidMount() {
    this.props.fetchTeams();

    document.title = 'Teams - ' + document.title;
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
    if (!this.props.teams) {
      return <Loading message="Loading your teams..." />;
    }

    const actions = [
      <Link to={`/teams`}>
        <FlatButton primary label="Cancel" onTouchTap={this.onCloseDialog} />
      </Link>,
    ];

    const createButton = (
      <RaisedButton
        secondary
        className="add-button"
        onTouchTap={this.onOpenDialog}
        label="Create a team"
      />
    );

    const { editTeam, dialogIsOpen } = this.state;

    return (
      <div className="Teams">
        <FlatButton
          primary
          label="Back"
          icon={<NavigationArrowBack />}
          containerElement={<Link to="/" />}
        />

        {this.props.teams.length > 0
          ? <List
              userId={this.props.userId}
              teams={this.props.teams}
              onDelete={this.props.deleteTeam}
            />
          : <Empty createButton={createButton} />}

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
            userId={this.props.userId}
          />
        </Dialog>

        {this.props.teams.length > 0 && createButton}
      </div>
    );
  }
}

export default Teams;
