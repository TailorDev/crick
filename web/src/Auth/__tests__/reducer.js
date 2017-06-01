import reducer from '../reducer';

it('should return the initial state', () => {
  const state = reducer(undefined, {});

  expect(state.isAuthenticated).toBe(false);
  expect(state.token).toBe(null);
  expect(state.login).toBe(null);
  expect(state.api_token).toBe(null);
  expect(state.avatar_url).toBe(null);
});
