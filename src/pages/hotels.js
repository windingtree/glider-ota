import React, {useState} from 'react';
import HotelsSearchResults from "../components/hotels-search-results/hotels-search-results";
import HotelDetails from "../components/hotels-rooms/hotel-details";

export default function HotelsPageContent({searchResults}) {
    const [selectedHotel, setSelectedHotel] = useState();
    console.log("searchResults", searchResults)
    return (
        <>
            {selectedHotel === undefined &&
            <HotelsSearchResults onHotelSelected={setSelectedHotel} searchResults={searchResults}/>}
            {selectedHotel !== undefined && <HotelDetails searchResults={searchResults} hotel={selectedHotel}/>}
        </>
    )
}

