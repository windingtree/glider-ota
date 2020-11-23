import React, {useEffect, useState} from 'react'
import { enGB } from 'date-fns/locale'
import { DateRangePicker, START_DATE, END_DATE } from 'react-nice-dates'
import 'react-nice-dates/build/style.css'
import style from './travel-datepickup.module.scss'
import {Row,Col} from "react-bootstrap";
import {parse,format} from "date-fns";
const DATE_FORMAT='yyyy-MM-dd';


export default function TravelDatepickup({initialStart,initialEnd,onStartDateChanged,onEndDateChanged, startPlaceholder='Departure', endPlaceholder='Return', label, localstorageKey}) {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    onStartDateChanged(date);
    if(localstorageKey && date)
      localStorage.setItem(`inputfield-${localstorageKey}-startdate`, format(date,DATE_FORMAT));
  }

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onEndDateChanged(date);
    if(localstorageKey && date)
      localStorage.setItem(`inputfield-${localstorageKey}-enddate`, format(date,DATE_FORMAT));
  }

  useEffect(()=>{
    console.log('useEffect')
    if(localstorageKey) {
      let storedStart = localStorage.getItem(`inputfield-${localstorageKey}-startdate`);
      let storedEnd = localStorage.getItem(`inputfield-${localstorageKey}-enddate`);


      if(storedStart){
        try{
          let parsed =parse(storedStart,DATE_FORMAT,new Date());
          console.log('Parsed:',parsed)
          handleStartDateChange(parsed)
        }catch(err){
          console.log('Cant parse start date:',err)
        }
      }
      if(storedEnd){
        try{
          let parsed = parse(storedEnd,DATE_FORMAT,new Date());
          handleEndDateChange(parsed)
        }catch(err){
          console.log('Cant parse end  date:',err)
        }
      }
    }
  },[])

    return (<>
          {label && <div className={style.label}>{label}</div>}
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
            // <div className='date-range container-fluid '>
            <div className={style.dateRange}>
              <Row >
                <Col className={style.formElem} sm={6}>

                  <input
                      className={'date-range__input' + (focus === START_DATE ? ' focused' : '')}
                      {...startDateInputProps}
                      placeholder={startPlaceholder} readOnly={true}
                  />
                </Col>
                <Col className={style.formElem} sm={6}>
                  <input
                      className={'date-range__input' + (focus === END_DATE ? ' focused' : '')}
                      {...endDateInputProps}
                      placeholder={endPlaceholder} readOnly={true}
                  />
                </Col>
              </Row>
            </div>
        )}
      </DateRangePicker>
            </>
    )
}
