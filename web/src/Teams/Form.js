/* @flow */
import React from 'react';

const initialState = {
  name: '',
  user_ids: [],
  projects: [],
};

class Form extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = initialState;

    (this: any).onNameChange = this.onNameChange.bind(this);
    (this: any).onSubmit = this.onSubmit.bind(this);
  }

  props: {
    onSave: Function,
  };

  state: {
    name: string,
    user_ids: Array<string>,
    projects: Array<string>,
  };

  onNameChange(e: SyntheticInputEvent) {
    this.setState({ name: e.target.value });
  }

  canSubmit() {
    return this.state.name.trim() !== '';
  }

  onSubmit(e: SyntheticEvent) {
    e.preventDefault();

    if (this.canSubmit()) {
      this.props.onSave(this.state);
      this.setState(initialState);
    }
  }

  render() {
    return (
      <form>
        <p>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.onNameChange}
          />
        </p>
        <p>
          <input
            type="submit"
            onClick={this.onSubmit}
            disabled={!this.canSubmit()}
          />
        </p>
      </form>
    );
  }
}

export default Form;
