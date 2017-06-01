import React from 'react';
import { shallow } from 'enzyme';
import Component from '../presenter';

it('renders without crashing', () => {
  shallow(<Component message={''} />);
});
