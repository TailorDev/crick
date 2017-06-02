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
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import moment from 'moment';
import CalendarHeatmap from 'react-calendar-heatmap';
import Loading from '../Common/Loading';
import Form from './Form';
import Report from './Report';
import type { RouterHistory, Location, Match } from 'react-router-dom';
import type { Frame, Report as ReportType } from '../types';
import './index.css';

const prettyDiffDate = (d1, d2) => {
  return moment.utc(moment(d2).diff(moment(d1))).format('HH:mm:ss');
};

class Project extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      showFrames: false,
    };

    (this: any).onToggleFramesDisplay = this.onToggleFramesDisplay.bind(this);
  }

  state: {
    showFrames: boolean,
  };

  props: {
    // routing
    history: RouterHistory,
    location: Location,
    match: Match,
    compileReport: Function,
    updateDateSpan: Function,
    updateTags: Function,
    frames: Array<Frame>,
    from: moment,
    to: moment,
    tags: Array<string>,
    project: ?string,
    report: ReportType,
    fetchData: Function,
    workloads: Array<Object>,
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.fetchData(
        this.props.match.params.id,
        this.props.from,
        this.props.to,
        this.props.tags,
        10000
      );
    }
  }

  componentWillReceiveProps(nextProps: Object) {
    if (
      nextProps.from !== this.props.from ||
      nextProps.to !== this.props.to ||
      nextProps.tags !== this.props.tags
    ) {
      this.props.fetchData(
        this.props.match.params.id,
        nextProps.from,
        nextProps.to,
        nextProps.tags,
        10000
      );
    }

    if (nextProps.frames !== this.props.frames) {
      this.props.compileReport(nextProps.frames);
    }
  }

  onToggleFramesDisplay() {
    this.setState(prevState => {
      return { showFrames: !prevState.showFrames };
    });
  }

  getColor(value: Object) {
    if (!value) {
      return 'color-empty';
    }

    return `color-scale-${value.workload}`;
  }

  render() {
    if (!this.props.project) {
      return <Loading message="Loading..." />;
    }

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

        <FlatButton
          label="Back to projects"
          primary={true}
          icon={<NavigationArrowBack />}
          className="Project-back"
          containerElement={<Link to="/" />}
        />

        <div className="Project-head">
          <h2 className="Project-name">{this.props.project}</h2>

          <div className="Project-workload">
            <CalendarHeatmap
              numDays={300}
              values={this.props.workloads}
              classForValue={this.getColor}
            />
          </div>
        </div>

        <Form
          from={this.props.from}
          to={this.props.to}
          tags={this.props.tags}
          onUpdateDateSpan={this.props.updateDateSpan}
          onUpdateTags={this.props.updateTags}
        />

        <Report
          total={this.props.report.total}
          tagReports={this.props.report.tagReports}
        />

        {this.props.frames.length > 0
          ? <FlatButton
              label={
                this.state.showFrames
                  ? `Hide ${this.props.frames.length} frames`
                  : `Show ${this.props.frames.length} frames`
              }
              onTouchTap={this.onToggleFramesDisplay}
              secondary={true}
              fullWidth={true}
            />
          : ''}

        {this.state.showFrames
          ? <Table className="Project-frames">
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
              <TableBody displayRowCheckbox={false} stripedRows={false}>
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
          : ''}

        <FlatButton
          label="Back to projects"
          primary={true}
          containerElement={<Link to="/" />}
          icon={<NavigationArrowBack />}
          className="Project-back"
        />
      </div>
    );
  }
}

export default Project;
