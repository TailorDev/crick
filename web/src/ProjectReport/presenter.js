/* @flow */
import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import Report from '../Common/Report';
import './index.css';

const getColor = (value: Object) => {
  if (!value) {
    return 'color-empty';
  }

  return `color-scale-${value.workload}`;
};

const Project = (props: Object) => {
  const { workloads, ...otherProps } = props;

  return (
    <Report backURL="/" {...otherProps}>
      <div className="Report-workload">
        <CalendarHeatmap
          numDays={300}
          values={props.workloads}
          classForValue={getColor}
        />
      </div>
    </Report>
  );
};

export default Project;
