/* @flow */
import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import ChipInput from 'material-ui-chip-input';
import { Link } from 'react-router-dom';
import type { User, Team, NewTeam } from '../types';

const initialState: NewTeam = {
  name: '',
  users: [],
  projects: [],
  owner_id: '',
};

class Form extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = props.team ? {
      name: props.team.name,
      users: props.team.users,
      projects: props.team.projects,
      owner_id: props.team.owner_id,
    } : initialState;

    (this: any).onNameChange = this.onNameChange.bind(this);
    (this: any).onSubmit = this.onSubmit.bind(this);
    (this: any).onAutoCompleteMember = this.onAutoCompleteMember.bind(this);
    (this: any).onMembersChange = this.onMembersChange.bind(this);
    (this: any).onProjectAdd = this.onProjectAdd.bind(this);
    (this: any).onProjectRemove = this.onProjectRemove.bind(this);
  }

  props: {
    onCreate: Function,
    onUpdate: Function,
    userId: string,
    team: ?Team,
    suggestedUsers: Array<User>,
    autoCompleteUsers: Function,
  };

  state: {
    name: string,
    users: Array<User>,
    projects: Array<string>,
    owner_id: string,
  };

  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.team && nextProps.team !== null) {
      const t: Team = nextProps.team;

      this.setState({
        name: t.name,
        users: t.users,
        projects: t.projects,
        owner_id: t.owner_id,
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
    if (this.canSubmit()) {
      if (this.props.team) {
        this.props.onUpdate({
          ...this.state,
          id: this.props.team.id,
        });
      } else {
        this.props.onCreate(this.state);
      }

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
            defaultValue={this.state.users}
            onChange={this.onMembersChange}
          />
        </div>
        <div>
          <ChipInput
            fullWidth
            value={this.state.projects}
            hintText="e.g. world-domination-plan"
            floatingLabelText="Team projects"
            onRequestAdd={this.onProjectAdd}
            onRequestDelete={this.onProjectRemove}
          />
        </div>
        <div>
          <Link to={`/teams`}>
            <RaisedButton
              primary
              fullWidth
              label={this.props.team ? 'Update' : 'Create'}
              onClick={this.onSubmit}
              disabled={!this.canSubmit()}
            />
          </Link>
        </div>
      </form>
    );
  }
}

export default Form;
