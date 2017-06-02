/* @flow */
import React from 'react';
import Loading from '../Common/Loading';
import Project from './Project';
import Empty from './Empty';
import './index.css';

class Projects extends React.Component {
  props: {
    token: string,
    login: string,
    projects: ?Array<Object>,
    fetchProjects: Function,
  };

  componentDidMount() {
    this.props.fetchProjects();
  }

  render() {
    if (!this.props.projects) {
      return (<Loading message="Loading your projects..." />);
    }

    if (this.props.projects.length === 0) {
      return <Empty login={this.props.login} token={this.props.token} />;
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
