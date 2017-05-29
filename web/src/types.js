/* @flow */

// Taken from: https://github.com/fbsamples/f8app
export type Action = Object;
export type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

export type Team = {
  id: string,
  name: string,
  projects: Array<string>,
  users: Array<User>,
};

export type User = {
  id: string,
  login: string,
};
