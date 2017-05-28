/* @flow */
import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const prettyDiffDate = (d1, d2) => {
  return moment.utc(
    moment(d2).diff(moment(d1))
  ).format("HH:mm:ss");
};

class Project extends React.Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.fetchFrames(this.props.match.params.id);
    }
  }

  render() {
    if (!this.props.frames) {
      return (
        <div>
          <p>no frames</p>
          <Link to="/">back</Link>
        </div>
      );
    }

    return (
      <div>
        <h2>Project {this.props.match.params.id}</h2>
        <ul>
          {this.props.frames.map(f => (
            <li key={f.id}>
              {moment(f.start_at).format('YYYY-MM-DD HH:mm')}
              &nbsp;
              to
              &nbsp;
              {moment(f.end_at).format('HH:mm')}
              &nbsp;
              -
              &nbsp;
              {prettyDiffDate(f.start_at, f.end_at)}
              &nbsp;
              -
              &nbsp;
              Tags: {f.tags.join(', ')}
            </li>
          ))}
        </ul>

        <Link to="/">back</Link>
      </div>
    );
  }
}

export default Project;
