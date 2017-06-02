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

    // NB: DatePicker component manipulates JavaScript Date objects
    this.state = {
      from: this.props.from ? this.props.from.toDate() : null,
      to: this.props.to ? this.props.to.toDate() : null,
      tags: this.props.tags ? this.props.tags : [],
    };

    (this: any).onFromChange = this.onFromChange.bind(this);
    (this: any).onToChange = this.onToChange.bind(this);
    (this: any).onTagsChange = this.onTagsChange.bind(this);
  }

  state: {
    from: ?Date,
    to: ?Date,
    tags: Array<string>,
  };

  props: {
    from: moment,
    to: moment,
    tags: Array<string>,
    onUpdateDateSpan: Function,
    onUpdateTags: Function,
  };

  onFromChange(e: SyntheticInputEvent, from: Date) {
    this.setState({ from: from }, () => {
      this.props.onUpdateDateSpan(
        moment(this.state.from),
        moment(this.state.to)
      );
    });
  }

  onToChange(e: SyntheticInputEvent, to: Date) {
    this.setState({ to: to }, () => {
      this.props.onUpdateDateSpan(
        moment(this.state.from),
        moment(this.state.to)
      );
    });
  }

  onTagsChange(tags: Array<string>) {
    this.setState({ tags: tags }, () => {
      this.props.onUpdateTags(tags);
    });
  }

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
              onChange={this.onFromChange}
              value={this.state.from}
            />
          </div>
          <div className="filter-wrapper to">
            <DatePicker
              floatingLabelText="To"
              hintText="Pick a end date"
              autoOk={true}
              onChange={this.onToChange}
              value={this.state.to}
            />
          </div>
          <div className="filter-wrapper tags">
            <ChipInput
              hintText="e.g. email or meeting"
              floatingLabelText="Tags"
              newChipKeyCodes={[13, 32, 188]}
              onChange={this.onTagsChange}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Form;
