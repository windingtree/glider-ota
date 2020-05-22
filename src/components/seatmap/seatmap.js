import React, { useState } from 'react'
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Cabin from '../cabin';
import SegmentSelector from '../segment-selector';
import SeatLegend from '../seat-legend';
import SeatCard from '../seat-card'
import './seatmap.scss';

export default function SeatMap(props) {
    // Destructure the seatmap properties
    const {
        cabin,
        segment,
        passengers,
        initialPrice,
        currency,
    } = props;

    // Get the states
    const [activePassengerIndex, setActivePassengerIndex] = useState(0);
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Return the current itinerary
    const getItinerary = () => {
        const { index, stops } = segment;
        return `${stops[index]} - ${stops[index+1]}`;
    };

    // Get the total price
    const getTotal = () => {
        return initialPrice;
    };

    // Handle events on the Seat Card
    const handleSeatCardSelect = (index) => {
        console.log(`[SEATMAP] SeatCard selected: ${index}`);
        setActivePassengerIndex(index);
    };

    const handleSeatCardRemove = (index) => {
        console.log(`[SEATMAP] SeatCard removed: ${index}`);
        setActivePassengerIndex(index);
    };

    // Handle events on the Seat Map
    const handleCabinSeatSelectionChange = (seatNumber, selected) => {
        console.log(`[SEATMAP] Cabin seat selected: ${seatNumber}|${selected}`);
        

        // Add the seat to the selected seats when selected
        if(selected) {
            // Update the selected seats
            let seats = selectedSeats;
            seats.push({
                number: seatNumber,
                code: 'mySeatCode',
                passengerIndex: activePassengerIndex,
            });
            setSelectedSeats(seats);

            // Update the current passenger index, modulo the number of passengers
            setActivePassengerIndex((activePassengerIndex + 1) % passengers.length);
        }

        // Remove the seats fro the selected otherwise
        else {
            setSelectedSeats(selectedSeats.filter(seat => {
                return seat.number !== seatNumber;
            }));
        }
        
    }

    // Get the details of a seat at a given index
    const getSeatPropertiesForSeatCard = (passengerIndex) => {
        for(let i=0; i<selectedSeats.length; i++) {
            const seat = selectedSeats[i];
            if(passengerIndex === seat.passengerIndex) {
                return {
                    seatNumber: seat.number,
                    seatCharacteristics: ['K','W','LA'],
                    priceAmount: 180,
                }
            }
        }
        return {};
    };

    // Get the current passenger type
    const getCurrentPassenger = () => {
        return passengers[activePassengerIndex];
    };

    // Variable to check if all seats are selected
    const allSeatsSelected = (selectedSeats.length === passengers.length);

    // Render the component
    return (
        <Container fluid>
            <Row>
                <Col>
                    <h2 className='seatmap-h2'>Departure Flight: {getItinerary()}</h2>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    <Row>
                        <Col>
                            <SegmentSelector {...segment}/>
                            <SeatLegend/>
                        </Col>
                    </Row>
                    <Row className='seatcard-row'>
                        {passengers.map(({type, name}, index) => (
                            <Col xs={12} sm={6} md={12} lg={6} xl={4} className='seatcard-col' key={index}>
                                <SeatCard
                                    // Passenger related properties
                                    active={(index===activePassengerIndex) && !allSeatsSelected}
                                    passengerName={name}
                                    passengerType={type}

                                    // Seat related properties
                                    priceCurrency={currency}
                                    {...getSeatPropertiesForSeatCard(index)}
                                    
                                    // Handle events
                                    handleSelect={() => handleSeatCardSelect(index)}
                                    handleRemove={() => handleSeatCardRemove(index)}
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col xs={12} md={6}>
                    <Cabin 
                        {...cabin}
                        handleSeatSelectionChange={handleCabinSeatSelectionChange}
                        passengerType={getCurrentPassenger().type}
                        maxSelection={passengers.length}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    <h2 className='seatmap-h2-price'>Total Price: {currency} {getTotal()}</h2>
                </Col>
                <Col xs={12} md={6}>
                    <Row>
                        <Col xs={6}>
                            <Button 
                                className='seatmap-btn-secondary'
                                onClick={console.log}
                            >
                                Skip
                            </Button>
                        </Col>
                        <Col xs={6}>
                            <Button
                                className='seatmap-btn-primary'
                                onClick={console.log}
                            >
                                Continue
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}