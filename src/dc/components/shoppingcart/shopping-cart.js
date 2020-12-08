import React from 'react'
import {Container, Row, Col, Button} from 'react-bootstrap'
import {connect} from "react-redux";
import {hotelOfferSelector, flightOfferSelector, errorSelector, bookAction} from "../../../redux/sagas/cart";


const FlightInCart = ({offer}) => {
    return (<div>Flight</div>)
}
const HotelInCart = ({offer}) => {
    return (<div>Hotel</div>)
}


export function ShoppingCart({flightOffer, hotelOffer, error, onProceedToBook}) {

    const onBookHandler = () => {
        if (onProceedToBook) {
            onProceedToBook()
        } else {
            console.warn('onProceedToBook is not defined');
        }
    }

    return (
        <Container>
            <Row>
                Your trip so far
            </Row>
            {flightOffer && <FlightInCart offer={flightOffer}/>}
            {hotelOffer && <HotelInCart offer={hotelOffer}/>}
            <Button variant="outline-primary" size="md" onClick={onBookHandler}>Book</Button>
        </Container>
    )
}

const mapStateToProps = state => ({
    flightOffer: flightOfferSelector(state),
    hotelOffer: hotelOfferSelector(state),
    error: errorSelector(state)
});


const mapDispatchToProps = (dispatch) => {
    return {
        onProceedToBook: (offer) => {
            dispatch(bookAction())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);
