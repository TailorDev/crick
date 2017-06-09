/* @flow */
import { connect } from 'react-redux';
import moment from 'moment';
import ProjectReport from './presenter';
import {
  compileReport,
  fetchFrames,
  updateDateSpan,
  updateTags,
  fetchWorkloads,
  updateProjectData,
  // selectors
  selectProjectName,
  selectProjectReportState,
} from './reducer';
import type { Action, Frame } from '../types';

const mapStateToProps = state => {
  const projectReport = selectProjectReportState(state);

  return {
    title: selectProjectName(projectReport),
    frames: projectReport.frames,
    report: projectReport.report,
    from: projectReport.from,
    to: projectReport.to,
    tags: projectReport.tags,
    workloads: projectReport.workloads,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  fetchData: (
    id: string,
    from: moment,
    to: moment,
    tags: Array<string>,
    limit: number
  ) => {
    dispatch(fetchFrames(id, from, to, tags, limit));
    dispatch(fetchWorkloads(id));
  },
  compileReport: (frames: Array<Frame>) => dispatch(compileReport(frames)),
  updateDateSpan: (from: moment, to: moment) => {
    dispatch(updateDateSpan(from, to));
  },
  updateTags: (tags: Array<string>) => dispatch(updateTags(tags)),
  setData: (from: moment, to: moment, tags: Array<string>) => {
    dispatch(updateProjectData(from, to, tags));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectReport);
