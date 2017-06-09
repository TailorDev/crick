/* @flow */
import React from 'react';
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import TagReport from './TagReport';
import { prettyDuration } from '../../utils';
import type { TagReports } from '../../types';
import './summary.css';

type Props = {
  total: number,
  tagReports: TagReports,
  onSelectTag: Function,
};

const Summary = (props: Props) =>
  <div className="Summary-wrapper">
    <div className="Summary">
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
              onClick={props.onSelectTag}
            />
          );
        })}
      </List>
    </div>
  </div>;

export default Summary;
