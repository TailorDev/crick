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
      login: '',
      token: '',
    };

    this.handleTokenDialogClose = this.handleTokenDialogClose.bind(this);
    this.handleTokenDialogOpen = this.handleTokenDialogOpen.bind(this);
  }

  props: {
    isAuthenticated: boolean,
    token: string,
    onLogout: Function,
    onLogin: Function,
  };

  state: {
    isTokenDialogOpen: boolean,
    login: string,
    token: string,
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

    this.fetchMe(this.props.token);
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      if (nextProps.token !== null) {
        this.fetchMe(nextProps.token);
      } else {
        this.setState({ login: '' });
      }
    }
  }

  // this is old school, we should use redux-api-middleware instead
  fetchMe(token: string) {
    const headers: Object = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    fetch(`${process.env.REACT_APP_API_HOST || ''}/users/me`, { headers })
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({
          login: json.login,
          token: json.token,
        });
      })
    ;
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
              <code>{this.state.token}</code>
            </pre>
          </Dialog>

          <IconMenu
            className="user-menu"
            iconButtonElement={
              <Avatar>
                {this.state.login.charAt(0).toUpperCase()}
              </Avatar>
            }
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
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
