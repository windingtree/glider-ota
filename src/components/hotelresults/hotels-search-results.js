import React from 'react'
import style from './hotel-search-results.module.scss'
import {Container, Row} from 'react-bootstrap'
import _ from 'lodash'
import SingleHotel from "./single-hotel";
import {HotelSearchResultsFilterHelper} from "../../utils/hotel-search-results-filter-helper";

export default function HotelsSearchResults({searchResults, onHotelSelected, filters}) {
    if (searchResults === undefined) {
        return (<>No hotels found</>)
    }
    const helper = new HotelSearchResultsFilterHelper(searchResults);
    const results = helper.generateSearchResults(filters);

    return (
        <Container fluid={false}>
            <div className='pt-5'/>
            <Row className={style.hotelsSearchResultsWrapper}>
                {
                    _.map(results, (result, id) => {
                        let hotel = result.hotel;
                        let bestoffer = result.bestoffer;
                        return (<SingleHotel hotel={hotel} bestoffer={bestoffer} key={id} handleClick={onHotelSelected}/>)
                    })
                }
            </Row>
        </Container>
    )

}
