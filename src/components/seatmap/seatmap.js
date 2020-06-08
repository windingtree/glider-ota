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
        handleSeatMapContinue,
        handleSeatMapSkip,
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
        const total = Number(initialPrice) + selectedSeats.reduce((subtotal, seat) => {
            const seatProperties = getSeatProperties(seat.number);
            const seatPrice = (seatProperties && seatProperties.price) ?  Number(seatProperties.price.public) : 0;
            return Number(subtotal + seatPrice);
        }, 0);
        return Number(total).toFixed(2);
    };

    // Set active the next passenger seat card
    const activateNextPassengerSeatCard = (updatedSeats) => {
        // Only if there are still passengers to select
        if(updatedSeats.length < passengers.length) {
            // Get the index of seated passengers
            const passengerIndexesWithSeats = updatedSeats.map(seat => seat.passengerIndex);

            // Search for the next unseated passenger after the active passenger
            for(let i=0; i<passengers.length; i++) {
                const index = (activePassengerIndex + i + 1) % passengers.length;
                if(!passengerIndexesWithSeats.includes(index)) {
                    setActivePassengerIndex(index);
                    break;
                }
            }
        }

        else {
            // Force React to re-render
            setActivePassengerIndex(undefined);
        }
    };

    // Handle events on the Seat Card
    const handleSeatCardSelect = (index) => {
        setActivePassengerIndex(index);
    };

    // Handle a click on the Remove button for de-association
    const handleSeatCardRemove = (index) => {
        setActivePassengerIndex(index);
        setSelectedSeats(selectedSeats.filter(seat => seat.passengerIndex !== index));
    };

    // Handle events on the Seat Map
    const handleCabinSeatSelectionChange = (seatNumber, selected) => {
        // Add the seat to the selected seats when selected
        if(selected) {
            // Update the selected seats
            let updatedSeats = selectedSeats;
            updatedSeats.push({
                number: seatNumber,
                passengerIndex: activePassengerIndex,
                optionCode: getSeatProperties(seatNumber).optionCode,
            });

            // Update the selected seats
            setSelectedSeats(updatedSeats);
            activateNextPassengerSeatCard(updatedSeats);
        }

        // Otherwise, remove the seat number from the selection
        else {
            setActivePassengerIndex(selectedSeats.find(seat => seat.number === seatNumber).passengerIndex);
            setSelectedSeats(selectedSeats.filter(seat => seat.number !== seatNumber));
        }
        
    }

    // Reset the seatmap component
    const resetSeatmap = () => {
        setSelectedSeats([]);
        setActivePassengerIndex(0);
    };

    // Handle the Skip button
    const handleSkip = () => {
        handleSeatMapSkip();
        resetSeatmap();
    };

    // Handle the Continue button
    const handleContinue = () => {
        handleSeatMapContinue(selectedSeats);
        resetSeatmap();
    };

    // Get the details of a given seat number
    const getSeatProperties = (seatNumber) => {
        // Destructure properties of the cabin
        const { seats, prices } = cabin;

        // Get the proper seat and price
        const seat = seats.find(seat => seat.number === seatNumber);
        const price = seat && seat.optionCode && prices[seat.optionCode];

        return {...seat, price: price};
    };

    // Get the details of a seat at a given index
    const getSeatPropertiesForSeatCard = (passengerIndex) => {
        // Get the seat
        const seat = selectedSeats.find(seat => seat.passengerIndex === passengerIndex);
        if(!seat) {
            return {}
        }

        // Get the seat properties
        const seatProperties = getSeatProperties(seat.number);
        return {
            seatNumber: seat.number,
            seatCharacteristics: seatProperties.characteristics,
            priceAmount: (seatProperties.price && seatProperties.price.public) ? Number(seatProperties.price.public) : 'Free',
        }
    };

    // Get the current passenger type
    const getCurrentPassenger = () => {
        return activePassengerIndex ? passengers[activePassengerIndex] : {};        
    };

    // Variable to check if all seats are selected
    const allSeatsSelected = () => {
        return (selectedSeats.length === passengers.length);
    };

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
                            <Col xs={12} sm={6} md={12} lg={6} className='seatcard-col' key={index}>
                                <SeatCard
                                    // Passenger related properties
                                    active={!allSeatsSelected() && (index === activePassengerIndex)}
                                    passengerName={name}
                                    passengerType={type}
                                    cabinName={cabin.name}

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
                        selectedSeats={selectedSeats.map(seat => seat.number)}
                    />
                </Col>
            </Row>
            <Row className='action-row'>
                <Col xs={12} md={6}>
                    <h2 className='seatmap-h2-price'>Total Price: {currency} {getTotal()}</h2>
                </Col>
                <Col xs={12} md={6}>
                    <Row>
                        <Col xs={6}>
                            <Button 
                                className='seatmap-btn-secondary'
                                variant='secondary'
                                onClick={handleSkip}
                            >
                                Skip
                            </Button>
                        </Col>
                        <Col xs={6}>
                            <Button
                                className='seatmap-btn-primary'
                                onClick={handleContinue}
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