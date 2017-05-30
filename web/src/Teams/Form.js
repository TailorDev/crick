/* @flow */
import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ChipInput from 'material-ui-chip-input';
import type { User, Team, NewTeam } from '../types';

const initialState: NewTeam = {
  name: '',
  users: [],
  projects: [],
};

class Form extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = initialState;

    (this: any).onNameChange = this.onNameChange.bind(this);
    (this: any).onSubmit = this.onSubmit.bind(this);
    (this: any).onAutoCompleteMember = this.onAutoCompleteMember.bind(this);
    (this: any).onMembersChange = this.onMembersChange.bind(this);
    (this: any).onProjectAdd = this.onProjectAdd.bind(this);
    (this: any).onProjectRemove = this.onProjectRemove.bind(this);
  }

  props: {
    onSave: Function,
    team?: ?Team,
    suggestedUsers: Array<User>,
    autoCompleteUsers: Function,
  };

  state: {
    name: string,
    users: Array<User>,
    projects: Array<string>,
  };

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.team !== nextProps.team && nextProps.team) {
      const t: Team = nextProps.team;

      this.setState({
        name: t.name,
        users: t.users,
        projects: t.projects,
      });
    }
  }

  onNameChange(e: SyntheticInputEvent) {
    this.setState({ name: e.target.value });
  }

  onMembersChange(users: Array<User>) {
    this.setState({ users });
  }

  onProjectAdd(project: string) {
    this.setState({ projects: this.state.projects.concat(project) });
  }

  onProjectRemove(project: string) {
    this.setState({ projects: this.state.projects.filter(p => p !== project) });
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

  onAutoCompleteMember(input: string) {
    this.props.autoCompleteUsers(input);
  }

  render() {
    return (
      <form>
        <div>
          <TextField
            fullWidth
            hintText="e.g. Team Rocket"
            floatingLabelText="Team name"
            value={this.state.name}
            onChange={this.onNameChange}
          />
        </div>
        <div>
          <ChipInput
            fullWidth
            fullWidthInput
            hintText="John Doe"
            floatingLabelText="Team members"
            dataSource={this.props.suggestedUsers}
            dataSourceConfig={{ text: 'login', value: 'id' }}
            onUpdateInput={this.onAutoCompleteMember}
            onChange={this.onMembersChange}
          />
        </div>
        <div>
          <ChipInput
            fullWidth
            value={this.state.projects}
            hintText="e.g. emails"
            floatingLabelText="Team projects"
            onRequestAdd={this.onProjectAdd}
            onRequestDelete={this.onProjectRemove}
          />
        </div>
        <div>
          <RaisedButton
            primary
            fullWidth
            label="Create"
            onClick={this.onSubmit}
            disabled={!this.canSubmit()}
          />
        </div>
      </form>
    );
  }
}

export default Form;
