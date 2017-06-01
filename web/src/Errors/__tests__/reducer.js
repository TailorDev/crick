import reducer from '../reducer';

it('should return the initial state', () => {
  const state = reducer(undefined, {});

  expect(state.message).toBe('');
});
