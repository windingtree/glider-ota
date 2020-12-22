import venue from "./venue.json"


const getDate = (strDate, defaultValue) =>{
    try{
        return new Date(strDate)
    }catch(err){

    }
    return defaultValue;
}

export const venueConfig={
    originAirport: venue.originAirport,
    destinationAirport: venue.destinationAirport,
    destinationCity:venue.destinationCity,
    venueName:venue.venueName,
    startDate:getDate(venue.start_date),
    endDate:getDate(venue.end_date)
}
