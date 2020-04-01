import React from 'react'
import { enGB } from 'date-fns/locale'
import { DateRangePicker, START_DATE, END_DATE } from 'react-nice-dates'

import 'react-nice-dates/build/style.css'
import './travel-datepickup.scss'

export default class TravelDatepickup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      startDate: undefined,
      endDate: undefined
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
  }

  handleStartDateChange (date) {
    this.setState({ startDate: date });
    if (this.props.onStartDateChanged) { this.props.onStartDateChanged(date) }
  }

  handleEndDateChange (date) {
    this.setState({ endDate: date });
    if (this.props.onEndDateChanged) { this.props.onEndDateChanged(date) }
  }

  render () {
    return (<>
      <DateRangePicker
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        onStartDateChange={this.handleStartDateChange}
        onEndDateChange={this.handleEndDateChange}
        minimumDate={new Date()}
        format='MMM dd, EEE'
        locale={enGB}
      >
        {({ startDateInputProps, endDateInputProps, focus }) => (
          <div className='date-range'>
            <input
              className={'date-range__input' + (focus === START_DATE ? ' -focused' : '')}
              {...startDateInputProps}
              placeholder='Departure'
            />
            <span className='date-range_arrow' />
            <input
              className={'date-range__input' + (focus === END_DATE ? ' -focused' : '')}
              {...endDateInputProps}
              placeholder='Return'
            />
          </div>
        )}
      </DateRangePicker>
            </>
    )
  }
}
