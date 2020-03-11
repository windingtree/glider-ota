import React from 'react'
import './passenger-selector.scss'
import { Button, Dropdown } from 'react-bootstrap'

export default class PassengerSelector extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      adults: 1,
      children: 0,
      infants: 0
    };
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
  }

  increase (type) {
    if (this.state[type] >= 9) { return }
    const state = this.state;
    state[type] += 1;
    this.updateState(state)
  }

  decrease (type) {
    if (this.state[type] <= 0) { return }
    const state = this.state;
    state[type] -= 1;
    this.updateState(state)
  }
  total(){
    return this.state.adults+this.state.children;
  }

  updateState (state) {
    this.setState(state);
    if(this.props.onPaxSelectionChanged!==undefined){
      this.props.onPaxSelectionChanged()
    }
  }

  validate(){

  }


  render () {
    const total = this.total();
    return (
      <>
        <Dropdown>
          <Dropdown.Toggle variant='outline-dark' className='passenger-selector--dropdown' id='dropdown-basic'>
            {total} passenger{total > 1 ? 's' : ''}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <div className='passenger-selector--wrapper' aria-labelledby='dropdownMenuButton'>
              <div className='passenger-selector--title'>
                <strong>Adults</strong><small>over 12</small>
              </div>
              <div className='passenger-selector--button-decr'><Button onClick={() => this.decrease('adults')} variant='dark' size='sm'>-</Button></div>
              <div className='passenger-selector--pax-count'>{this.state.adults}</div>
              <div className='passenger-selector--button-incr'><Button onClick={() => this.increase('adults')} variant='dark' size='sm'>+</Button></div>
            </div>
            <div className='passenger-selector--wrapper'>
              <div className='passenger-selector--title'>
                <strong>Children</strong><small>2 to 12 years old</small>
              </div>
              <div className='passenger-selector--button-decr'><Button onClick={() => this.decrease('children')} variant='dark' size='sm'>-</Button></div>
              <div className='passenger-selector--pax-count'>{this.state.children}</div>
              <div className='passenger-selector--button-incr'><Button onClick={() => this.increase('children')} variant='dark' size='sm'>+</Button></div>
            </div>

            <div className='passenger-selector--wrapper'>
              <div className='passenger-selector--title'>
                <strong>Infants</strong><small>Up to 2 years old</small>
              </div>
              <div className='passenger-selector--button-decr'><Button onClick={() => this.decrease('infants')} variant='dark' size='sm'>-</Button></div>
              <div className='passenger-selector--pax-count'>{this.state.infants}</div>
              <div className='passenger-selector--button-incr'><Button onClick={() => this.increase('infants')} variant='dark' size='sm'>+</Button></div>
            </div>

          </Dropdown.Menu>
        </Dropdown>
      </>
    /*

            </Dropdown> */
    )
  }
}
