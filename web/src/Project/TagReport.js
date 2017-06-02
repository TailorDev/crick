/* @flow */
import React from 'react';
import { ListItem } from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';
import { prettyDuration } from '../utils';
import type { TagReport as TagReportType } from '../types';

type Props = {
  total: number,
  tagReport: TagReportType,
};

const TagReport = (props: Props) => (
  <ListItem
    key={props.tagReport.tag}
    className="tag"
    primaryText={props.tagReport.tag}
    secondaryText={prettyDuration(props.tagReport.duration)}
  >
    <LinearProgress
      mode="determinate"
      value={(props.tagReport.duration / props.total) * 100}
      className="tag-ratio-bar"
    />
  </ListItem>
);

export default TagReport;
