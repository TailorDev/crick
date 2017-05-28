/* @flow */
import React from 'react';

class Projects extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      projects: [],
    };
  }

  props: {
    isAuthenticated: boolean,
    token: string,
  };

  state: {
    projects: Array<Object>,
  };

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.fetchProjects(this.props.token);
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      if (nextProps.token !== null) {
        this.fetchProjects(nextProps.token);
      } else {
        this.setState({ projects: [] });
      }
    }
  }

  fetchProjects(token: string) {
    const headers: Object = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    fetch('/projects', { headers })
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({
          projects: json,
        });
      })
    ;
  }

  render() {
    return (
      <div>
        <h2>Projects</h2>
        <ul>
          {this.state.projects.map(p => <li>{p.name}</li>)}
        </ul>
      </div>
    );
  }
}

export default Projects;
