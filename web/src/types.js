/* @flow */
import type { TeamReportState } from './TeamReport/reducer';
import type { ProjectReportState } from './ProjectReport/reducer';
import type { AuthState } from './Auth/reducer';
import type { ProjectsState } from './Projects/reducer';
import type { TeamsState } from './Teams/reducer';
import type { ErrorsState } from './Errors/reducer';

// Taken from: https://github.com/fbsamples/f8app
export type Action = Object;
export type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

export type State = {
  auth: AuthState,
  projects: ProjectsState,
  projectReport: ProjectReportState,
  teams: TeamsState,
  errors: ErrorsState,
  teamReport: TeamReportState,
};

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

export type Project = {
  id: string,
  name: string,
};

export type Frame = {
  id: string,
  start_at: Date,
  end_at: Date,
  tags: Array<string>,
};

export type TagReport = {
  tag: string,
  duration: number,
};

export type TagReports = Array<TagReport>;

export type Report = {
  total: number,
  tagReports: TagReports,
};
