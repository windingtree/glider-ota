import React from 'react'
import './stopover-filter.scss'
import Form from 'react-bootstrap/Form'
export default class StopoverFilter extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      all: true,
      direct: true,
      one_stop: true,
      two_stop: true
    };
    this.onChangeAll = this.onChangeAll.bind(this);
    this.onChangeDirect = this.onChangeDirect.bind(this);
    this.onChangeOne = this.onChangeOne.bind(this);
    this.onChangeTwo = this.onChangeTwo.bind(this)
  }

  onChangeAll (evt) { this.setState({ all: evt.target.checked }) }
  onChangeDirect (evt) { this.setState({ direct: evt.target.checked }) }
  onChangeOne (evt) { this.setState({ one_stop: evt.target.checked }) }
  onChangeTwo (evt) { this.setState({ two_stop: evt.target.checked }) }

  render () {
    return (
      <div className='filter-wrapper'>
        <div className='card-body'>
          <h5 className='card-title filter-title'>STOPS</h5>
          <div className='card-text filter-content'>
            <Form.Check id='filter-stops-all' className='filter-stops--checkbox' checked={this.state.all} onChange={this.onChangeAll} label='All' />
            <Form.Check id='filter-stops-direct' className='filter-stops--checkbox' checked={this.state.direct} onChange={this.onChangeDirect} label='Direct flights only' />
            <Form.Check id='filter-stops-one' className='filter-stops--checkbox' checked={this.state.one_stop} onChange={this.onChangeOne} label='1 stop' />
            <Form.Check id='filter-stops-two' className='filter-stops--checkbox' checked={this.state.two_stop} onChange={this.onChangeTwo} label='2 stops' />
          </div>
        </div>
      </div>
    )
  }
}
