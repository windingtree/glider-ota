import React from 'react'
import './stopover-filter.css'
import Form from 'react-bootstrap/Form'
import ReactBootstrapSlider from 'react-bootstrap-slider';
import "bootstrap-slider/dist/css/bootstrap-slider.css"

export default class PriceRangeFilter extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      currentValue: 1,
      step: 1,
      max: 100,
      min: 0
    };
    this.changeValue = this.changeValue.bind(this);
    // this.onChangeDirect = this.onChangeDirect.bind(this);
    // this.onChangeOne = this.onChangeOne.bind(this);
    // this.onChangeTwo = this.onChangeTwo.bind(this)
  }

  changeValue (evt) {
    console.log('Change value:',evt)
  }


  render () {
    return (
      <div className='filter-wrapper'>
        <div className='card-body'>
          <h5 className='card-title filter-title'>PRICE</h5>
          <div className='card-text filter-content'>
            <ReactBootstrapSlider
                value={this.state.currentValue}
                change={this.changeValue}
                slideStop={this.changeValue}
                step={this.state.step}
                max={this.state.max}
                min={this.state.min}
                orientation="horizontal"
                reversed={true} />
          </div>
        </div>
      </div>
    )
  }
}
