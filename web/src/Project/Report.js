/* @flow */
import React from 'react';
import {List, ListItem} from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';
import Subheader from 'material-ui/Subheader';
import './report.css';
import moment from 'moment';
import type {TagReports} from '../types';


type Props = {
  total: number,
  tagReports: TagReports
};

const Report = (props: Props) => (
  <div className="Report-wrapper">
    <div className="Report">
      <Subheader>Report</Subheader>
      <div className="total">
        {`${moment.duration(props.total).humanize()}`}
      </div>
      <List className="tags">
        {
          props.tagReports.map((tagReport) => {
            return (
              <ListItem
                key={tagReport[0]}
                className="tag"
                primaryText={tagReport[0]}
                secondaryText={`${moment.duration(tagReport[1]).humanize()}`}
              >
                <LinearProgress
                  mode="determinate"
                  value={(tagReport[1] / props.total) * 100}
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
