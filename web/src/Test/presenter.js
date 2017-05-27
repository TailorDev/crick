/* @flow */
import React from 'react';

class Test extends React.Component {
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

    this.fetchMe(this.props.token);
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      if (nextProps.token !== null) {
        this.fetchMe(nextProps.token);
      } else {
        this.setState({ projects: [] });
      }
    }
  }

  fetchMe(token: string) {
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
      <ul>
      {this.state.projects.map(p => <li>{p.name}</li>)}
      </ul>
    );
  }
}

export default Test;
