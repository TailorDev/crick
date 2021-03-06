/* @flow */
import React from 'react';
import ActionBackupIcon from 'material-ui/svg-icons/action/backup';
import Paper from 'material-ui/Paper';
import ClipboardInput from '../Common/ClipboardInput';
import style from '../shared/emptyStyle';

type Props = {
  token: string,
  login: string,
};

const Empty = ({ login, token }: Props) =>
  <div className="Empty">
    <Paper style={style.paper} zDepth={1}>
      <ActionBackupIcon style={style.icon} color="#5ec3a0" />
      <h4 style={style.title}>Hello @{login}, you are almost done!</h4>
      <p>
        Crick is Watson's most famous colleague,
        {' '}
        <a href="https://en.wikipedia.org/wiki/Francis_Crick">true story</a>
        .
        Therefore, you need to connect
        {' '}
        <a href="https://github.com/TailorDev/Watson">Watson</a>
        {' '}
        to your Crick account,
        which will allow you to synchronize both and get insights on your
        different activities.
        <br />
        <br />
      </p>
      <h5>1. Execute the two commands below to configure Watson:</h5>
      <div>
        <ClipboardInput
          value={[
            'watson config backend.url',
            `${process.env.REACT_APP_API_HOST || ''}/watson`,
          ].join(' ')}
        />
        <ClipboardInput value={`watson config backend.token ${token}`} />
      </div>
      <h5>2. Now you can synchronize your frames with Crick:</h5>
      <div>
        <ClipboardInput value="watson sync" />
      </div>
    </Paper>
  </div>;

export default Empty;
