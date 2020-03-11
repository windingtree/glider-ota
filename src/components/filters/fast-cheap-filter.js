import React from 'react'
import './fast-cheap-filter.scss'
import { ButtonGroup, ToggleButton } from 'react-bootstrap'
export default class FastCheapFilter extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: 1
    };
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (val) { this.setState({ value: val }) }

  render () {
    return (
      <ButtonGroup toggle className='fastest-cheapest-wrapper' value={this.state.value} onChange={this.handleChange}>
        <ToggleButton className='fastest-cheapest-button' type='radio' name='radio' value='1'>
                    Cheapest
        </ToggleButton>
        <ToggleButton className='fastest-cheapest-button' type='radio' name='radio' value='2'>
                    Fastest
        </ToggleButton>
      </ButtonGroup>
    )
  }
}
