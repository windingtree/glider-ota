import React, {useEffect, useState} from 'react';
import PaymentConfirmation from "../components/payments/payment-confirmation";
import Header from "../components/common/header/header";
import Footer from "../components/common/footer/footer";


export default function ConfirmationPage({match}) {
    let confirmedOfferId = match.params.confirmedOfferId;
    return (
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>
                    <PaymentConfirmation orderID={confirmedOfferId}/>
                </div>
                <Footer/>

            </div>
    )
}



