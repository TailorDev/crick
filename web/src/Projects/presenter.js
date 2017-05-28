/* @flow */
import React from 'react';
import Project from './Project';

class Projects extends React.Component {
  props: {
    isAuthenticated: boolean,
    projects: Array<Object>,
    fetchProjects: Function,
  };

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    this.props.fetchProjects();
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      this.props.fetchProjects();
    }
  }

  render() {
    return (
      <div>
        <h2>Projects</h2>
        <ul>
          {this.props.projects.map(p => <Project key={p.id} {...p} />)}
        </ul>
      </div>
    );
  }
}

export default Projects;
