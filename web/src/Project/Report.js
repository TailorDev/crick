/* @flow */
import React from 'react';
import {List, ListItem} from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';
import Subheader from 'material-ui/Subheader';
import './report.css';
import moment from 'moment';
import type { TagReports } from '../types';


type Props = {
  total: number,
  tagReports: TagReports,
};

const prettyDuration = (duration) => {
  const d = moment.duration(duration);
  const hours = Math.floor(d.asHours());
  const minutes = Math.floor(d.subtract(hours, 'hours').asMinutes());
  let durationStr = hours > 0 ? `${hours} hours ` : '';
  durationStr += minutes > 0 ? `${minutes} min` : '';
  return durationStr
}

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
              <ListItem
                key={tagReport.tag}
                className="tag"
                primaryText={tagReport.tag}
                secondaryText={prettyDuration(tagReport.duration)}
              >
                <LinearProgress
                  mode="determinate"
                  value={(tagReport.duration / props.total) * 100}
                  className="tag-ratio-bar"
                />
              </ListItem>
            );
          })
        }
      </List>
    </div>
  </div>
);

export default Report;
