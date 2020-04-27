import React, {useState} from 'react'
import {Overlay, Popover, ListGroup, Form, Col,Row, Container} from 'react-bootstrap'
import './location-lookup.scss'
import {config} from '../../config/default'
export const LOCATION_SOURCE={
    AIRPORTS:'airports',
    CITIES:'cities'
}

const result = {"results":[{"primary":"Angelholm/Helsingborg","secondary":"AGH","search":"Angelholm/Helsingborg AGH","iata":"AGH","type":"AIRPORT"},{"primary":"Albany","secondary":"ALH","search":"Albany ALH","iata":"ALH","type":"AIRPORT"},{"primary":"Blythe","secondary":"BLH","search":"Blythe BLH","iata":"BLH","type":"AIRPORT"},{"primary":"Vilhena","secondary":"BVH","search":"Vilhena BVH","iata":"BVH","type":"AIRPORT"},{"primary":"Coolah","secondary":"CLH","search":"Coolah CLH","iata":"CLH","type":"AIRPORT"},{"primary":"Delhi","secondary":"DEL","search":"Delhi DEL","iata":"DEL","type":"AIRPORT"},{"primary":"Dalhart","secondary":"DHT","search":"Dalhart DHT","iata":"DHT","type":"AIRPORT"},{"primary":"Duluth","secondary":"DLH","search":"Duluth DLH","iata":"DLH","type":"AIRPORT"},{"primary":"Basel/Mulhouse","secondary":"BSL","search":"Basel/Mulhouse BSL","iata":"BSL","type":"AIRPORT"},{"primary":"Basel/Mulhouse","secondary":"EAP","search":"Basel/Mulhouse EAP","iata":"EAP","type":"METROPOLITAN"},{"primary":"Mulhouse/Basel","secondary":"EAP","search":"Mulhouse/Basel EAP","iata":"EAP","type":"METROPOLITAN"},{"primary":"Mulhouse/Basel","secondary":"MLH","search":"Mulhouse/Basel MLH","iata":"MLH","type":"AIRPORT"},{"primary":"North Eleuthera","secondary":"ELH","search":"North Eleuthera ELH","iata":"ELH","type":"AIRPORT"},{"primary":"Flotta","secondary":"FLH","search":"Flotta FLH","iata":"FLH","type":"AIRPORT"},{"primary":"Greenville","secondary":"GLH","search":"Greenville GLH","iata":"GLH","type":"AIRPORT"},{"primary":"Kulhudhuffushi","secondary":"HDK","search":"Kulhudhuffushi HDK","iata":"HDK","type":"AIRPORT"},{"primary":"Ulanhot","secondary":"HLH","search":"Ulanhot HLH","iata":"HLH","type":"AIRPORT"},{"primary":"Bullhead City","secondary":"IFP","search":"Bullhead City IFP","iata":"IFP","type":"AIRPORT"},{"primary":"Illesheim","secondary":"ILH","search":"Illesheim ILH","iata":"ILH","type":"AIRPORT"},{"primary":"Ilheus","secondary":"IOS","search":"Ilheus IOS","iata":"IOS","type":"AIRPORT"},{"primary":"Kolhapur","secondary":"KLH","search":"Kolhapur KLH","iata":"KLH","type":"AIRPORT"},{"primary":"Lahr","secondary":"LHA","search":"Lahr LHA","iata":"LHA","type":"AIRPORT"},{"primary":"Lahore","secondary":"LHE","search":"Lahore LHE","iata":"LHE","type":"AIRPORT"},{"primary":"Lightning Ridge","secondary":"LHG","search":"Lightning Ridge LHG","iata":"LHG","type":"AIRPORT"},{"primary":"Lereh","secondary":"LHI","search":"Lereh LHI","iata":"LHI","type":"AIRPORT"},{"primary":"Laohekou","secondary":"LHK","search":"Laohekou LHK","iata":"LHK","type":"AIRPORT"},{"primary":"Lehu","secondary":"LHP","search":"Lehu LHP","iata":"LHP","type":"AIRPORT"},{"primary":"Las Heras","secondary":"LHS","search":"Las Heras LHS","iata":"LHS","type":"AIRPORT"},{"primary":"Lianshulu","secondary":"LHU","search":"Lianshulu LHU","iata":"LHU","type":"AIRPORT"},{"primary":"Lock Haven","secondary":"LHV","search":"Lock Haven LHV","iata":"LHV","type":"AIRPORT"}]};

export default function LocationLookup({locationsSource,initialLocation,onLocationSelected, placeHolder})  {
    const [value, setValue] = useState(initialLocation!=undefined?initialLocation.primary:'');
    const [target, setTarget] = useState();
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [matchingLocations, setMatchingLocations] = useState([]);

    function handleLocationSelected(location) {
        console.debug('Selected location', location);
        setSelectedLocation(location);
        setMatchingLocations([]);
        setValue(location.primary);
        onLocationSelected(location)
    }
    function isLocationSelected() {
        return selectedLocation !== undefined;
    }

    function clearSelectedLocation() {
        setSelectedLocation(undefined);
        onLocationSelected(undefined);
    }

    function handleInputValueChange(event) {
        const enteredText = event.target.value;
        setValue(enteredText);
        setTarget(event.target);
        // unset only if exact location was already set (to prevent unnecessary event triggering)
        if (isLocationSelected()) {
            clearSelectedLocation()
        }
        if(config.OFFLINE_MODE)
            setMatchingLocations(result.results);

        if (enteredText.length>=2) {
            let request = {
                type: locationsSource,
                query: enteredText
            }
            fetch('/api/lookup', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(request)

            })
                .then((resp) => resp.json())
                .then(function (data) {
                    let results = data.results;
                    setMatchingLocations(results);
                })
                .catch(function (error) {
                    console.error('Lookup request failed', error);
                });
        }
    }
/*
        if (isLocationSelected()) {
            // if an airport was selected, overwrite text entered by user with full airport name
            setValue(selectedLocation.primary);
        }*/
/*    console.log("Initial location for lookup:",initialLocation)
    if(initialLocation!=undefined){
        console.log("initialLocation",initialLocation)
        console.log("initialLocation.primary",initialLocation.primary)
        console.log("initialLocation[\"primary\"]",initialLocation["primary"])
        console.log("initialLocation['primary']",initialLocation['primary']);
        console.log("initialLocation josn",JSON.parse(initialLocation).primary);
    }*/
        return (
            <div className="location-lookup">
                <Form.Control
                    type="text"
                    value={value}
                    onChange={handleInputValueChange}
                    className="location-lookup__input" placeholder={placeHolder}>
                </Form.Control>
                <Overlay
                    show={matchingLocations.length > 0}
                    target={target}
                    placement="bottom-start">
                    <Popover id="popover-contained" className="location-lookup__popover">
                            <LocationsList locations={matchingLocations} onLocationSelected={handleLocationSelected}/>
                    </Popover>
                </Overlay>
            </div>
        )

}

const LocationsList = ({locations, onLocationSelected}) =>{
    let key = 0;
    return (
        <Container fluid={true}>
            {locations.map(location=>{
                return (
                    <Row className='location-lookup__item'  key={location.primary+location.secondary} onClick={event => onLocationSelected(location)}>
                        <Col xs={8} className='location-lookup__item--primary'>{location.primary}</Col>
                        <Col xs={4} className='location-lookup__item--secondary'>{location.secondary}</Col>
                    </Row>
                )
            })}
        </Container>)
}
