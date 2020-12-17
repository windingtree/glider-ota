import React, { useEffect, useState } from 'react';
import style from './payment-selector.module.scss';
import { retrievePassengerDetails } from '../../../utils/api-utils';
import Spinner from '../common/spinner';
import PaymentCC from './payment-cc';
import PaymentCrypto from './payment-crypto';

const PaymentCard = props => {
    const {
        name,
        title,
        selected,
        onSelected,
        offStyle,
        component,
        amount,
        currency
    } = props;
    const isSelected = selected === name;
    const containerWrapperStyle = isSelected
        ? style.paymentCardContainer
        : `${style.paymentCardContainer} ${offStyle ? offStyle : ''}`;

    return (
        <div className={containerWrapperStyle}>
            <div
                className={style.titleWrapper}
                onClick={() => onSelected(name)}
            >
                <div className={style.title}>
                    <span className={
                        isSelected
                        ? `${style.selector} ${style.selected}`
                        : style.selector
                    }></span>
                    <span>
                        {title}
                    </span>
                </div>
                <div className={style.paymentAmount}>
                    {amount} {currency}
                </div>
            </div>
            {isSelected && component}
        </div>
    );
};

// - amount
// - currency
// - confirmedOfferId,
// - passengers
// should be provided as props
export default props => {
    const {
        confirmedOffer
    } = props;
    const {
        public: amount,
        currency
    } = confirmedOffer.offer.price;
    const [selectedCard, setSelectedCard] = useState('cc');
    const [isLoading, setLoading] = useState(true);
    const [passengerDetails, setPassengerDetails] = useState();

    useEffect(() => {
        retrievePassengerDetails()
            .then(passengers=>{
                passengers.sort((a,b)=>{
                    const typeA=a.type?a.type:'ADT';  //if there is no type - assume it's adult
                    const typeB=b.type?b.type:'ADT';
                    return typeA.localeCompare(typeB);
                });
                setPassengerDetails(passengers);
                setLoading(false);
            })
            .catch(err=>{
                console.error("Failed to load passenger details", err);
            });
    }, [confirmedOffer]);

    if (isLoading) {
        return (
            <Spinner enabled={true} />
        );
    }

    return (
        <>
            <div className={style.paymentSelectorContainer}>
                <PaymentCard
                    {...props}
                    name='crypto'
                    title='Pay with Crypto and save 3%'
                    amount={amount}
                    currency={currency}
                    selected={selectedCard}
                    onSelected={setSelectedCard}
                    offStyle={style.unicorn}
                    component={(
                        <PaymentCrypto
                            confirmedOfferId={confirmedOffer.offerId}
                        />
                    )}
                />
                <PaymentCard
                    name='cc'
                    title='Pay with boring Credit Card'
                    amount={amount}
                    currency={currency}
                    selected={selectedCard}
                    onSelected={setSelectedCard}
                    offStyle={null}
                    component={(
                        <PaymentCC
                            confirmedOfferId={confirmedOffer.offerId}
                            passengers={passengerDetails}
                        />
                    )}
                />
            </div>
        </>
    );
};
