/* @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import Clipboard from 'clipboard';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import './style.css';

class ClipboardInput extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      showConfirmation: false,
    };

    (this: any).setInputRef = this.setInputRef.bind(this);
    (this: any).setButtonRef = this.setButtonRef.bind(this);
    (this: any).onShowNotification = this.onShowNotification.bind(this);
    (this: any).onCloseNotification = this.onCloseNotification.bind(this);
  }

  $button: ?HTMLElement;
  $input: ?HTMLElement;
  clipboard: Clipboard;

  state: {
    showConfirmation: boolean,
  };

  props: {
    value: string,
  };

  componentDidMount() {
    this.clipboard = new Clipboard(this.$button, {
      target: () => this.$input,
    });

    this.clipboard.on('success', this.onShowNotification);
  }

  componentWillUnmount() {
    this.clipboard && this.clipboard.destroy();
  }

  setInputRef(node: HTMLElement) {
    // cf. https://github.com/facebook/flow/issues/3548
    const $el = ReactDOM.findDOMNode(node);

    if ($el && $el.firstElementChild instanceof HTMLElement) {
      this.$input = $el.firstElementChild;
    }
  }

  setButtonRef(node: React$Component<*, *, *>) {
    // cf. https://github.com/facebook/flow/issues/3548
    const $el = ReactDOM.findDOMNode(node);

    if ($el instanceof HTMLElement) {
      this.$button = $el;
    }
  }

  onShowNotification() {
    this.setState({ showConfirmation: true });
  }

  onCloseNotification() {
    this.setState({ showConfirmation: false });
  }

  render() {
    return (
      <div className="ClipboardInput">
        {this.state.showConfirmation
          ? <Snackbar
              open
              message="Copied!"
              autoHideDuration={2000}
              onRequestClose={this.onCloseNotification}
            />
          : null}

        <TextField
          readOnly
          id={this.props.value}
          ref={this.setInputRef}
          value={this.props.value}
          underlineShow={false}
        />
        <FlatButton ref={this.setButtonRef}>
          Copy
        </FlatButton>
      </div>
    );
  }
}

export default ClipboardInput;
