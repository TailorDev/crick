import reducer, { API_REQUEST, API_ERROR, DEFAULT_MESSAGE } from '../reducer';

it('should return the initial state', () => {
  const state = reducer(undefined, {});

  expect(state.message).toBe('');
});

it('should catch API_REQUEST errors', () => {
  const state = reducer(undefined, {
    type: API_REQUEST,
  });

  expect(state.message).toBe('');
});

it('should catch API_ERROR without payload', () => {
  const state = reducer(undefined, {
    type: API_ERROR,
  });

  expect(state.message).toBe('An error has occured, retry later');
});

it('should catch API_ERROR errors with message in payload', () => {
  const state = reducer(undefined, {
    type: API_ERROR,
    payload: {
      message: 'error',
    },
  });

  expect(state.message).toBe('error');
});

it('should catch API_ERROR errors with detail in response', () => {
  const state = reducer(undefined, {
    type: API_ERROR,
    payload: {
      response: {
        detail: 'error',
      },
    },
  });

  expect(state.message).toBe('error');
});

it('should catch API_ERROR errors with no detail in response', () => {
  const state = reducer(undefined, {
    type: API_ERROR,
    payload: {
      response: {},
    },
  });

  expect(state.message).toBe(DEFAULT_MESSAGE);
});
