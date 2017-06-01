import React from 'react';
import { shallow } from 'enzyme';
import Component from '../NotConnected';

it('renders without crashing', () => {
  shallow(<Component />);
});
