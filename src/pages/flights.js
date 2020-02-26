import React from 'react';
import Header from '../components/common/header/header';
import Footer from '../components/common/footer/footer';
import ContentWrapper from '../components/common/content-wrapper';
import FlightsSearchForm from '../components/flights-search-form/flights-search-form'
import SearchCriteriaBuilder from "../utils/search-criteria-builder";
import FlightSearchResultsConverter from "../utils/flight-search-results-converter";
import FlightsSearchResults from "../components/flights-search-results/flights-search-results";
import FlightDetail from "../components/flights-offer-details/flight-detailed-view"
import dummy_data from '../data/response_converted.json'
import {extendResponse} from  '../utils/response-processor'
const OFFLINE_MODE = false;

const API_URL='/api/searchOffers'

export default class FlightsPage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            flight_search_results: OFFLINE_MODE?dummy_data:undefined,
            selected_combination:undefined,
            selected_offer:undefined
        };


        this.searchForFlights = this.searchForFlights.bind(this);
        this.displayOffer = this.displayOffer.bind(this);
    }

    searchForFlights (criteria) {
        this.search(criteria)
    }

    displayOffer (combinationId,offerId) {
        console.log("Display offer, offerID:",offerId," combination", combinationId)
        let results = this.state.flight_search_results
        let selectedCombination = results.combinations.find(c=>{return c.combinationId === combinationId})
        let selectedOffer =selectedCombination.offers.find(o=>{return o.offerId === offerId})
        this.setState({selected_combination:selectedCombination, selected_offer:selectedOffer});
    }

    search (criteria) {

        const criteriaBuilder = new SearchCriteriaBuilder();

        // TODO - handle search from city/railstation and different pax types
        const searchCriteria = criteriaBuilder
            .withDepartureFromAirport(criteria.origin.id)
            .withDepartureDate(criteria.departureDate)
            .withReturnFromAirport(criteria.destination.id)
            .withReturnDate(criteria.returnDate)
            .withPassengers(criteria.adults,criteria.children,criteria.infants)
            .build();

        console.log('Search criteria', searchCriteria);
        const me = this;

        const requestInfo = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(searchCriteria)
        };
        console.log("Request info:",requestInfo);
        fetch(API_URL, requestInfo)
            .then(function (res) {
                return res.json()
            })
            .then(function (data) {
                me.handleSearchResultsReceived( data );
            }).catch(function (err) {
            console.log(err)
        })
    }
    handleSearchResultsReceived(results){
        // let converter = new FlightSearchResultsConverter(results);
        let convertedResponse = extendResponse(results);
        this.setState({ flight_search_results: convertedResponse })
    }

    render() {
        let searchResultsAvailable = (this.state.flight_search_results !== undefined)
        let combinationWasSelected=(this.state.selected_combination!==undefined);

        return (
            <>
                <Header/>
                <ContentWrapper>
                    <FlightsSearchForm onSearchRequested={this.searchForFlights}/>
                    { searchResultsAvailable && !combinationWasSelected &&
                        (<FlightsSearchResults onOfferDisplay={this.displayOffer} searchResults={this.state.flight_search_results} />)
                    }

                    {combinationWasSelected &&
                        (<FlightDetail selectedCombination={this.state.selected_combination}
                                       selectedOffer={this.state.selected_offer}
                                       searchResults={this.state.flight_search_results} />)
                    }
                </ContentWrapper>
                <Footer/>
            </>
        )
    }

}



