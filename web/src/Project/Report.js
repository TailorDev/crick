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
        {prettyDuration(props.total)}
      </div>
      <List className="tags">
        {
          props.tagReports.map((tagReport) => {
            return (
              <TagReport
                total={props.total}
                tagReport={tagReport}
              />
            );
          })
        }
      </List>
    </div>
  </div>
);

export default Report;
