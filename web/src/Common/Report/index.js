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
import Loading from '../Loading';
import Form from './Form';
import Summary from './Summary';
import { prettyDiffDate } from '../../utils';
import {
  getFromDateFromQueryParams,
  getToDateFromQueryParams,
  getTagsFromQueryParams,
} from './utils';
import type { Match, RouterHistory } from 'react-router-dom';
import type { Frame, Report as ReportType } from '../../types';
import './index.css';

const DATE_FORMAT = 'YYYY-MM-DD';

class Report extends React.Component {
  constructor(props: Object) {
    super(props);

    this.state = {
      showFrames: false,
    };

    (this: any).onToggleFramesDisplay = this.onToggleFramesDisplay.bind(this);
    (this: any).onSelectTag = this.onSelectTag.bind(this);
  }

  state: {
    showFrames: boolean,
  };

  props: {
    // routing
    match: Match,
    history: RouterHistory,
    // actions
    compileReport: Function,
    updateDateSpan: Function,
    updateTags: Function,
    fetchData: Function,
    setData: Function,
    // data
    frames: Array<Frame>,
    from: moment,
    to: moment,
    tags: Array<string>,
    report: ReportType,
    // report metadata
    title: ?string,
    backURL: string,
    children?: React$Element<*>,
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.setData(
        getFromDateFromQueryParams(),
        getToDateFromQueryParams(),
        getTagsFromQueryParams()
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

  componentDidUpdate() {
    const params = [
      `from=${this.props.from.format(DATE_FORMAT)}`,
      `to=${this.props.to.format(DATE_FORMAT)}`,
    ];

    if (this.props.tags.length > 0) {
      params.push(`tags=${this.props.tags.join(',')}`);
    }

    const newSearch = `?${params.join('&')}`;
    const oldSearch = this.props.history.location.search;

    if (oldSearch !== newSearch) {
      this.props.history.push(`${this.props.match.url}${newSearch}`);
    }
  }

  onToggleFramesDisplay() {
    this.setState(prevState => {
      return { showFrames: !prevState.showFrames };
    });
  }

  onSelectTag(tag: string) {
    this.props.updateTags(this.props.tags.concat(tag));
  }

  render() {
    if (!this.props.title) {
      return <Loading message="Loading..." />;
    }

    return (
      <div className="Report-details">
        <FlatButton
          label="Back"
          primary={true}
          icon={<NavigationArrowBack />}
          className="Report-back"
          containerElement={<Link to={this.props.backURL} />}
        />

        <div className="Report-head">
          <h2 className="Report-name">{this.props.title}</h2>

          {this.props.children}
        </div>

        <Form
          from={this.props.from}
          to={this.props.to}
          tags={this.props.tags}
          onUpdateDateSpan={this.props.updateDateSpan}
          onUpdateTags={this.props.updateTags}
        />

        <Summary
          total={this.props.report.total}
          tagReports={this.props.report.tagReports}
          onSelectTag={this.onSelectTag}
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
          ? <Table className="Report-frames">
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
                {this.props.frames.map(f =>
                  <TableRow key={f.id} className="Report-frame">
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
                        {f.tags.map(t =>
                          <Chip key={t} className="tag">{t}</Chip>
                        )}
                      </div>
                    </TableRowColumn>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          : ''}

        <FlatButton
          label="Back"
          primary={true}
          containerElement={<Link to={this.props.backURL} />}
          icon={<NavigationArrowBack />}
          className="Report-back"
        />
      </div>
    );
  }
}

export default Report;
