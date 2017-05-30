/* @flow */
import React from 'react';
import Project from './Project';
import './index.css';


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
    if (
      this.props.isAuthenticated !== nextProps.isAuthenticated &&
      nextProps.isAuthenticated === true
    ) {
      this.props.fetchProjects();
    }
  }

  render() {
    if (this.props.projects.length === 0) {
      return null;
    }

    return (
      <div className="Projects">
        <h2>Projects</h2>

        <div className="Project-list">
          {this.props.projects.map(p => <Project key={p.id} {...p} />)}
        </div>
      </div>
    );
  }
}

export default Projects;
