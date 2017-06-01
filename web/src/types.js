/* @flow */

// Taken from: https://github.com/fbsamples/f8app
export type Action = Object;
export type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

export type NewTeam = {
  name: string,
  projects: Array<string>,
  users: Array<User>,
  owner_id: string,
};

export type Team = {
  id: string,
  name: string,
  projects: Array<string>,
  users: Array<User>,
  owner_id: string,
};

export type User = {
  id: string,
  login: string,
  avatar_url: string,
};

export type Frame = {
  id: string,
  start_at: Date,
  end_at: Date,
  tags: Array<string>,
};
