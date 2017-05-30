/* @flow */
import React from 'react';
import { Link } from 'react-router-dom';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import moment from 'moment';
import './index.css';

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
      <div className="Project-details">
        <h2>Project {this.props.match.params.id}</h2>

        <FlatButton
          label="< back"
          href="/"
        />

        <Table
          className="Project-frames"
        >
          <TableHeader
            displaySelectAll={false}
            enableSelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn>Start</TableHeaderColumn>
              <TableHeaderColumn>End</TableHeaderColumn>
              <TableHeaderColumn>Duration</TableHeaderColumn>
              <TableHeaderColumn>Tags</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            stripedRows={false}
          >
            {this.props.frames.map(f => (
              <TableRow key={f.id} className="Project-frame">
                <TableRowColumn className="start">
                  {moment(f.start_at).format('YYYY-MM-DD HH:mm')}
                </TableRowColumn>
                <TableRowColumn className="end">
                  {moment(f.end_at).format('YYYY-MM-DD HH:mm')}
                </TableRowColumn>
                <TableRowColumn className="duration">
                  {prettyDiffDate(f.start_at, f.end_at)}
                </TableRowColumn>
                <TableRowColumn className="tags">
                  <div className="tags-wrapper">
                    {f.tags.map(t => (
                      <Chip key={t} className="tag">{t}</Chip>
                    ))}
                  </div>
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <FlatButton
          label="< back"
          href="/"
        />
      </div>
    );
  }
}

export default Project;
