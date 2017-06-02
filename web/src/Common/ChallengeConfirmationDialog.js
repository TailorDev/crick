/* @flow */
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class ChallengeConfirmationDialog extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      value: '',
      allowConfirm: false,
    };

    (this: any).onChange = this.onChange.bind(this);
  }

  state: {
    value: string,
    allowConfirm: boolean,
  };

  props: {
    challenge: string,
    onCancel: Function,
    onConfirm: Function,
    children?: React$Element<*>,
  };

  onChange(event: SyntheticInputEvent) {
    const value = event.target.value;

    this.setState({
      value,
      allowConfirm: value === this.props.challenge,
    });
  }

  renderTitle() {
    return 'Are you ABSOLUTELY sure?';
  }

  render() {
    const { onConfirm, onCancel, children } = this.props;

    const actions = [
      <FlatButton label="Cancel" onTouchTap={onCancel} />,
      <RaisedButton
        primary
        label="Confirm"
        onTouchTap={onConfirm}
        disabled={!this.state.allowConfirm}
      />,
    ];

    return (
      <Dialog
        open
        title={this.renderTitle()}
        onRequestClose={onCancel}
        actions={actions}
      >
        <div>
          {children}
        </div>
        <TextField
          type="text"
          fullWidth
          name="challenge-confirmation-dialog"
          value={this.state.value}
          hintText={this.props.challenge}
          onChange={this.onChange}
        />
      </Dialog>
    );
  }
}

export default ChallengeConfirmationDialog;
