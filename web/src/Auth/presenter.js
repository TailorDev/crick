/* @flow */
import React from 'react';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import ActionSupervisorIcon from 'material-ui/svg-icons/action/supervisor-account';
import ActionLockIcon from 'material-ui/svg-icons/action/lock';
import type { RouterHistory, Location, Match } from 'react-router-dom';
import ClipboardInput from '../Common/ClipboardInput';
import './index.css';

export type Props = {
  // routing
  history: RouterHistory,
  location: Location,
  match: Match,
  // user infos
  token: string,
  avatar_url: string,
  isAuthenticated: boolean,
  // actions
  onLogout: Function,
  onLogin: Function,
  fetchUser: Function,
  onTeams: Function,
};

const iconButtonStyle = {
  marginTop: '-3px',
  padding: 0,
};

const anchorOrigin = {
  horizontal: 'right',
  vertical: 'bottom',
};

const targetOrigin = {
  horizontal: 'right',
  vertical: 'top',
};

class Auth extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      isTokenDialogOpen: false,
    };

    (this: any).handleTokenDialogClose = this.handleTokenDialogClose.bind(this);
    (this: any).handleTokenDialogOpen = this.handleTokenDialogOpen.bind(this);
  }

  props: Props;

  state: {
    isTokenDialogOpen: boolean,
  };

  handleTokenDialogClose() {
    this.setState({
      isTokenDialogOpen: false,
    });
  }

  handleTokenDialogOpen() {
    this.setState({
      isTokenDialogOpen: true,
    });
  }

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.props.fetchUser();
  }

  render() {
    if (this.props.isAuthenticated) {
      const actions = [
        <FlatButton
          label="Close"
          primary={true}
          onTouchTap={this.handleTokenDialogClose}
        />,
      ];

      return (
        <div className="Auth logged-in">
          <Dialog
            title="API token"
            actions={actions}
            modal={false}
            open={this.state.isTokenDialogOpen}
            onRequestClose={this.handleTokenDialogClose}
          >
            <p>Use this token to access Crick API, for instance with Watson:</p>

            <ClipboardInput value={this.props.token} />
          </Dialog>

          <IconMenu
            className="user-menu"
            iconButtonElement={
              <IconButton style={iconButtonStyle}>
                <Avatar src={this.props.avatar_url} />
              </IconButton>
            }
            anchorOrigin={anchorOrigin}
            targetOrigin={targetOrigin}
          >
            <MenuItem
              primaryText="My Teams"
              leftIcon={<ActionSupervisorIcon />}
              onTouchTap={this.props.onTeams}
            />
            <MenuItem
              primaryText="My API Token"
              leftIcon={<ActionLockIcon />}
              onTouchTap={this.handleTokenDialogOpen}
            />
            <Divider />
            <MenuItem primaryText="Sign out" onTouchTap={this.props.onLogout} />
          </IconMenu>
        </div>
      );
    }

    return (
      <div className="Auth logged-out">
        <FlatButton
          label="Login"
          className="action"
          onTouchTap={this.props.onLogin}
        />
      </div>
    );
  }
}

export default Auth;
