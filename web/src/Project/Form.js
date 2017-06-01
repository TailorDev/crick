/* @flow */
import React from 'react';
import ChipInput from 'material-ui-chip-input';
import DatePicker from 'material-ui/DatePicker';
import Subheader from 'material-ui/Subheader';
import moment from 'moment';
import './form.css';


class Form extends React.Component {
  constructor(props: Object) {
    super(props);
    const now = moment();

    this.state = {
      'from': now.subtract(1, 'week').format('YYYY-MM-DD'),
      'to': now.format('YYYY-MM-DD'),
      'tags': [],
    }
  }

  props: {};

  state: {
    from: string,
    to: string,
    tags: Array<string>,
  };

  render() {
    return (
      <div className="Frame-filters-form-wrapper">
        <Subheader>Filters</Subheader>

        <form className="Frame-filters-form">
          <div className="filter-wrapper form">
            <DatePicker
              floatingLabelText="From"
              hintText="Pick a start date"
              autoOk={true}
            />
          </div>
          <div className="filter-wrapper to">
            <DatePicker
              floatingLabelText="To"
              hintText="Pick a end date"
              autoOk={true}
            />
          </div>
          <div className="filter-wrapper tags">
            <ChipInput
              hintText="e.g. email or meeting"
              floatingLabelText="Tags"
              newChipKeyCodes={[13, 32, 188]}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Form;
