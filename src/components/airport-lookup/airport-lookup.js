import React from 'react'
import airports from './airports.json'
import {Overlay,Popover,ListGroup,Form }  from 'react-bootstrap'
import './airport-lookup.css'

const MAX_AIRPORTS_DISPLAYED = 5;

export default class AirportLookup extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: '',
      target: undefined,
      matchingAirports: [],
      selectedAirport: undefined
    };
    this.onAirportSelected = this.onAirportSelected.bind(this);
    this.handleInputValueChange = this.handleInputValueChange.bind(this);
    this.airports = this.preprocessLoadAirports()
  }

  preprocessLoadAirports () {
    return airports.map(rec => {
      return {
        id: rec.iata,
        primary: rec.name,
        secondary: rec.countryName
      }
    })
  }

  isAirportSelected () {
    return this.state.selectedAirport !== undefined
  }

  getSelectedAirport () {
    return this.state.selectedAirport
  }

  setSelectedAirport (location) {
    this.setState({ selectedAirport: location });
    this.notifyAboutSelectedAirportChange(location)
  }

  clearSelectedAirport () {
    this.setState({ selectedAirport: undefined });
    this.notifyAboutSelectedAirportChange(undefined)
  }

  notifyAboutSelectedAirportChange (airport) {
    if (this.props.onSelectedAirportChanged) { this.props.onSelectedAirportChanged(airport) }
  }

  checkPatternMatchIgnoreCase (textToSearch, searchPattern) {
    return textToSearch.toUpperCase().search(searchPattern.toUpperCase()) > -1
  }

  findMatchingAirports (pattern) {
    let matchingAirports = [];
    if (!pattern || pattern.length < 2) {
      // don't search if only 1 character was entered
    } else {
      // find matching and limit display to MAX_AIRPORTS_DISPLAYED
      let matchingCounter = 0;
      matchingAirports = this.airports.filter(rec => {
        return ((this.checkPatternMatchIgnoreCase(rec.id, pattern) ||
                    this.checkPatternMatchIgnoreCase(rec.primary, pattern) ||
                    this.checkPatternMatchIgnoreCase(rec.secondary, pattern)) && matchingCounter++ < MAX_AIRPORTS_DISPLAYED)
      });

      if (matchingAirports === undefined) { matchingAirports = [] }
    }
    this.setMatchingAirports(matchingAirports)
  }

  setMatchingAirports (locations) {
    this.setState({ matchingAirports: locations })
  }

  getMatchingAirports () {
    if (this.state.matchingAirports === undefined) { return [] }
    return this.state.matchingAirports
  }

  handleInputValueChange (event) {
    const enteredText = event.target.value;
    this.setState({ value: enteredText, target: event.target });

    // unset only if exact location was already set (to prevent unnecessary event triggering)
    if (this.isAirportSelected()) { this.clearSelectedAirport() }
    this.findMatchingAirports(enteredText)
  }

  render () {
    let selectebleListOfAirports = '';
    let showMatchedAirportList = false;
    const matchingAirports = this.getMatchingAirports();
    if (matchingAirports.length > 0) {
      // create a list of matching airports
      selectebleListOfAirports = this.createSelectableListOfAirports(matchingAirports);
      showMatchedAirportList = true
    }
    let value = this.state.value;
    if (this.isAirportSelected()) {
      // if an airport was selected, overwrite text entered by user with full airport name
      value = this.getSelectedAirport().primary
    }

    return (
      <div className='airports-component'>
        <Form.Control
          type='text'
          value={value}
          onChange={this.handleInputValueChange}
          className='airports-input'

        >
        </Form.Control>
        <Overlay
          show={showMatchedAirportList}
          target={this.state.target}
          placement='bottom'
        >
          <Popover id='popover-contained' className='airports-popover'>
            <Popover.Content className='airports-popovercontent'>
              {selectebleListOfAirports}
            </Popover.Content>
          </Popover>
        </Overlay>
      </div>
    )
  }

  // create list of airports to be displayed in a popup (after user enters airport name)
  createSelectableListOfAirports (airports) {
    if (airports.length > 0) {
      const listItems = airports.map((airport) =>
        <ListGroup.Item
          action
          className='airports-record'
          onClick={event => this.onAirportSelected(event, airport)}
          key={airport.id}
        >{this.renderSingleAirport(airport)}
        </ListGroup.Item>
      );
      return <ListGroup variant='flush' className='airports-list'>{listItems}</ListGroup>
    } else {
      return <ListGroup variant='flush' className='airports-list' />
    }
  }

  renderSingleAirport (airport) {
    return <><div className='airports-record--primary'>{airport.primary}</div><div className='airports-record--id'>({airport.id})</div></>
  }

  onAirportSelected (event, location) {
    console.log('Selected', location);
    this.setSelectedAirport(location);
    this.setMatchingAirports([])
  }
}
