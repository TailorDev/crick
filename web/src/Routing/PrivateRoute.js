/* @flow */
import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';

type Props = {
  component: React$Component<any, any, any>,
  store: Store,
};

export default ({ component: Component, store, ...rest }: Props): React$Element<any> => {
  const { auth } = store.getState();

  return (
    <Route {...rest} render={props => (
      auth.isAuthenticated ? (
        // $FlowFixMe: https://github.com/facebook/flow/issues/1660
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }}/>
      )
    )}/>
  );
};
