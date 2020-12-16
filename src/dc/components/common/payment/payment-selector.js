import React, { useState } from 'react';
import style from './payment-selector.module.scss';

const PaymentCard = props => {
    const {
        name,
        title,
        amount,
        currency,
        selected,
        onSelected,
        offStyle
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
                <div>
                    {amount} {currency}
                </div>
            </div>
            {isSelected &&
                <>
                    <div>Body</div>
                    <div>Footer</div>
                </>
            }
        </div>
    );
};

export default props => {
    const [selectedCard, setSelectedCard] = useState('cc');

    const amount = '1342.12';
    const currency = 'USD';

    return (
        <>
            <div>
                <div className='root-container-subpages'>
                    <PaymentCard
                        name='crypto'
                        title='Pay with Crypto and save 3%'
                        amount={amount}
                        currency={currency}
                        selected={selectedCard}
                        onSelected={setSelectedCard}
                        offStyle={style.unicorn}
                        {...props}
                    />
                    <PaymentCard
                        name='cc'
                        title='Pay with boring Credit Card'
                        amount={amount}
                        currency={currency}
                        selected={selectedCard}
                        onSelected={setSelectedCard}
                        offStyle={null}
                        {...props}
                    />
                </div>
            </div>
        </>
    );
};
