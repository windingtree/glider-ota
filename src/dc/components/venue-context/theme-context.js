import venue from "./venue.json"


const getDate = (strDate, defaultValue) =>{
    try{
        return new Date(strDate)
    }catch(err){

    }
    return defaultValue;
}

export const venueConfig={
    active: true,
    originAirport: venue.originAirport,
    destinationAirport: venue.destinationAirport,
    destinationLocation:venue.destinationLocation,
    venueName:venue.badgeVenueName,
    badgeVenueName:venue.badgeVenueName,
    badgeStartDate:getDate(venue.badgeStartDate),
    badgeEndDate:getDate(venue.badgeEndDate),
    startDate:getDate(venue.start_date),
    endDate:getDate(venue.end_date),

}
