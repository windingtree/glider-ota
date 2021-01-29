import React, { useEffect, useState } from 'react';
import style from './payment-selector.module.scss';
import { retrievePassengerDetails } from '../../utils/api-utils';
import Spinner from '../common/spinner';
import PaymentCC from './payment-cc';
import PaymentCrypto from './payment-crypto';
import {
    CRYPTO_PAYMENTS_DISABLED,
    CRYPTO_PAYMENTS_DISABLED_LABEL
} from '../../config/default';

const PaymentCard = props => {
    const {
        name,
        title,
        selected,
        onSelected,
        offStyle,
        component,
        amount,
        currency,
        disabled,
        disabledLabel
    } = props;
    const isSelected = selected === name;
    const containerWrapperStyle = isSelected
        ? style.paymentCardContainer
        : `${style.paymentCardContainer} ${offStyle ? offStyle : ''}`;

    return (
        <div className={`${containerWrapperStyle} ${disabled ? style.containerDisabled : ''}`}>
            <div
                className={`${style.titleWrapper} ${disabled ? style.titleWrapperDisabled : ''}`}
                onClick={!disabled
                    ? () => onSelected(name)
                    : () => {}}
            >
                <div className={`${style.title} ${disabled ? style.titleDisabled : ''}`}>
                    <span className={
                        isSelected
                        ? `${style.selector} ${style.selected}`
                        : style.selector
                    }></span>
                    <span>
                        {
                            disabled && disabledLabel
                                ? disabledLabel
                                : title
                        }
                    </span>
                </div>
                {isSelected && <div className={style.paymentAmount}>
                    {amount} {currency}
                </div>}
            </div>
            {isSelected && !disabled && component}
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
        confirmedOffer,
        paymentMethod,
        onPaymentMethodChange
    } = props;
    const {
        public: amount,
        currency
    } = confirmedOffer.totalPrice;
    // const [selectedCard, setSelectedCard] = useState(paymentMethod);
    const [isLoading, setLoading] = useState(true);
    const [passengerDetails, setPassengerDetails] = useState();

    console.log('PaymentSelector rendered, paymentMethod=',paymentMethod)

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

    //handle change of payment method
    const handlePaymentMethodChange = (method) => {
        // setSelectedCard(method);
        //update parent item so that call to /reprice can be made
        // (as price needs to be updated, it depends on payment method)
        onPaymentMethodChange(method);
    }

    return (
        <>
            <div className={style.paymentSelectorContainer}>
                <PaymentCard
                    {...props}
                    disabled={CRYPTO_PAYMENTS_DISABLED}
                    disabledLabel={CRYPTO_PAYMENTS_DISABLED_LABEL}
                    name='crypto'
                    title='Pay with Crypto and save 3%'
                    amount={amount}
                    currency={currency}
                    selected={paymentMethod}
                    onSelected={handlePaymentMethodChange}
                    offStyle={style.unicorn}
                    component={(
                        <PaymentCrypto
                            confirmedOfferId={confirmedOffer.offerId}
                        />
                    )}
                />
                <PaymentCard
                    name='card'
                    title='Pay with boring Credit Card'
                    amount={amount}
                    currency={currency}
                    selected={paymentMethod}
                    onSelected={handlePaymentMethodChange}
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
