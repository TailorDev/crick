/* @flow */
import React from 'react';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import './index.css';

class Auth extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      isTokenDialogOpen: false,
    };

    (this: any).handleTokenDialogClose = this.handleTokenDialogClose.bind(this);
    (this: any).handleTokenDialogOpen = this.handleTokenDialogOpen.bind(this);
  }

  props: {
    token: string,
    avatar_url: string,
    isAuthenticated: boolean,
    onLogout: Function,
    onLogin: Function,
    fetchUser: Function,
  };

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
            Copy/paste this token to access Crick API:
            <pre>
              <code>{this.props.token}</code>
            </pre>
          </Dialog>

          <IconMenu
            className="user-menu"
            iconButtonElement={
              <Avatar src={this.props.avatar_url} />
            }
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem
              primaryText="My API Token"
              onTouchTap={this.handleTokenDialogOpen}
            />
            <MenuItem
              primaryText="Sign out"
              onTouchTap={this.props.onLogout}
            />
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
