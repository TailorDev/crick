import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  window.fetch = jest.fn().mockImplementation(
    () => Promise.resolve({ json: () => ({ fullname: 'John Doe' }) })
  );

  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
