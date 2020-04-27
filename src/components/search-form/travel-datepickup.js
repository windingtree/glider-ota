import React, {useState} from 'react'
import { enGB } from 'date-fns/locale'
import { DateRangePicker, START_DATE, END_DATE } from 'react-nice-dates'
import 'react-nice-dates/build/style.css'
import './travel-datepickup.scss'

export default function TravelDatepickup({initialStart,initialEnd,onStartDateChanged,onEndDateChanged}) {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    onStartDateChanged(date);
  }

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onEndDateChanged(date);
  }
    return (<>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        minimumDate={new Date()}
        format='MMM dd, EEE'
        locale={enGB}
      >
        {({ startDateInputProps, endDateInputProps, focus }) => (
            <div className='date-range container-fluid '>
              <div className='row '>
                <div className='col-sm-6 pb-4'>
                  <input
                      className={'date-range__input' + (focus === START_DATE ? ' -focused' : '')}
                      {...startDateInputProps}
                      placeholder='Departure'
                  />
                </div>
                <div className='col-sm-6 pb-4'>
                  <input
                      className={'date-range__input' + (focus === END_DATE ? ' -focused' : '')}
                      {...endDateInputProps}
                      placeholder='Return'
                  />
                </div>
              </div>
            </div>
        )}
      </DateRangePicker>
            </>
    )
}
