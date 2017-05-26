/* @flow */
import React from 'react';

class Test extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      fullname: '',
    };
  }

  props: {
    isAuthenticated: boolean,
    token: string,
  };

  state: {
    fullname: string,
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
        this.setState({ fullname: '' });
      }
    }
  }

  fetchMe(token: string) {
    const headers: Object = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    fetch('/users/me', { headers })
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({
          fullname: json.fullname,
        });
      })
    ;
  }

  render() {
    return (
      <p>Hello, {`${this.state.fullname || 'Anonymous'}`}!</p>
    );
  }
}

export default Test;
