/* @flow */
import React from 'react';
import Avatar from 'material-ui/Avatar';
import Report from '../Common/Report';
import Subheader from 'material-ui/Subheader';
import type { Match } from 'react-router-dom';
import type moment from 'moment';
import type { Frame, Team, Report as ReportType } from '../types';
import './index.css';

type Props = {
  // routing
  match: Match,
  // report
  frames: Array<Frame>,
  team: ?Team,
  report: ReportType,
  from: moment,
  to: moment,
  tags: Array<string>,
  fetchData: Function,
  compileReport: Function,
  updateDateSpan: Function,
  updateTags: Function,
};

const avatarStyle = {
  marginRight: '5px',
};

const TeamReport = (props: Props) => {
  const { team, ...otherProps } = props;

  const name = team ? team.name : null;
  const users = team ? team.users : [];

  return (
    <Report backURL="/" title={name} {...otherProps}>
      <div className="Report-users">
        <Subheader>Members</Subheader>
        <div className="Report-users-list">
          {users.map(user =>
            <Avatar
              key={user.id}
              title={user.login}
              src={user.avatar_url}
              style={avatarStyle}
            />
          )}
        </div>
      </div>
    </Report>
  );
};

export default TeamReport;
