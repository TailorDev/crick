/* @flow */
import React from 'react';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TagReport from './TagReport';
import { prettyDuration } from '../utils';
import type { TagReports } from '../types';
import './report.css';

type Props = {
  total: number,
  tagReports: TagReports,
};

const Report = (props: Props) => (
  <div className="Report-wrapper">
    <div className="Report">
      <Subheader>Report</Subheader>
      <div className="total">
        {props.total
          ? prettyDuration(props.total)
          : <span>Nothing has been logged for this period.</span>}
      </div>
      <List className="tags">
        {props.tagReports.map(tagReport => {
          return (
            <TagReport
              key={tagReport.tag}
              total={props.total}
              tagReport={tagReport}
            />
          );
        })}
      </List>
    </div>
  </div>
);

export default Report;
