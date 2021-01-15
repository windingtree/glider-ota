import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Alert, Spinner as RoundSpinner } from 'react-bootstrap';
import { useHistory, useParams } from "react-router-dom";
import SelectCrypto from '../crypto/SelectCrypto';
import MetamaskButton from '../crypto/MetamaskButton';
// import PortisButton from '../crypto/PortisButton';
import WalletAddress from '../crypto/WalletAddress';
import styles from '../crypto/crypto.module.scss';
import Spinner from "../common/spinner"
import {
    walletAddress,
    web3ProviderType,
    openPortis,
    signInError
} from '../../../redux/sagas/web3';
import { createPaymentIntent } from "../../../utils/api-utils";

const CountDown = props => {
    const {
        value,
        onCountDown
    } = props;
    const [count, setCount] = useState(0);

    useEffect(() => {
        setCount(value);
    }, [value]);

    useEffect(() => {
        let timeout;
        if (count > 0) {
            timeout = setTimeout(() => {
                setCount(c => {
                    const nextCount = c - 1;
                    if (nextCount === 0) {
                        onCountDown();
                    }
                    return c - 1;
                });
            }, 1000);
        }

        return () => clearTimeout(timeout);
    }, [count, onCountDown]);

    return (
        <div className={styles.countDown}>
            <span>{count}</span>
        </div>
    );
};

const CryptoPaymentPage = props => {
    const {
        confirmedOfferId,
        walletAddress,
        signInError
    } = props;
    const history = useHistory();
    const [error, setError] = useState(null);
    const [isOfferLoading, setOfferLoading] = useState(false);
    const [deadline, setDeadline] = useState(0);
    // const [offer, setOffer] = useState(null);
    const [amountUSD, setAmountUSD] = useState(0);
    const [countDown, setCountDown] = useState(0);
    // const [finalOfferId, setFinalOfferId] = useState(confirmedOfferId)
    const createIntent = useCallback(() => {
        setOfferLoading(true);
        createPaymentIntent(confirmedOfferId, 'crypto')
            .then(data => {
                console.log(data);
                setDeadline(Math.ceil(Date.now() / 1000) + (60*60*20)); // @todo Set better value
                // setOffer(data.offer.offer);
                setAmountUSD(data.amount);
                setOfferLoading(false);
                setCountDown(120);
                // setFinalOfferId(data.offer.offerId)
                // console.log('retrieved final offer ID', data.offer.offerId)
            })
            .catch(err => {
                setError(err);
                setOfferLoading(false);
            });
    }, [confirmedOfferId]);

    useEffect(()=>{
        createIntent();
    }, [createIntent]);

    const handleOnCountDown = () => {
        setCountDown(0);
        createIntent();
    }

    const handlePaymentStart = () => {
        setCountDown(0);
    };

    const handlePaymentSuccess = confirmedOfferId => {
        const url=`/dc/confirmation/${confirmedOfferId}`;
        history.push(url);
    }

    const handlePaymentReset = () => {
        setCountDown(0);
        createIntent();
    };

    return (
        <div className={styles.payCryptoContainer}>
            {isOfferLoading &&
                <Spinner enabled={isOfferLoading}/>
            }
            {/* do not change construction below. this is helps avoid a strange "0" (zero) instead of void*/}
            {amountUSD && amountUSD>0 ?
                (
                    <>
                        <Row className={styles.walletRow}>
                            <Col>
                                <WalletAddress />
                                <MetamaskButton exclusive noLogout />
                            </Col>
                            <Col>
                                <div className={styles.countDownWrapper}>
                                    {isOfferLoading &&
                                        <div
                                            className={styles.countDownSpinner}
                                        />
                                    }
                                    {!isOfferLoading && countDown > 0 &&
                                        <CountDown
                                            value={countDown}
                                            onCountDown={handleOnCountDown}
                                        />
                                    }
                                </div>
                            </Col>
                        </Row>
                        {/* <Row className={styles.mb10}>
                            <Col>
                                <PortisButton exclusive />
                            </Col>
                        </Row> */}
                        {walletAddress &&
                            <SelectCrypto
                                title='Select a token'
                                usdValue={amountUSD}
                                confirmedOfferId={confirmedOfferId}
                                deadline={deadline}
                                onPaymentReset={() => handlePaymentReset()}
                                onPaymentStart={() => handlePaymentStart()}
                                onPaymentSuccess={() => handlePaymentSuccess(confirmedOfferId)}
                                onPaymentError={setError}
                            />
                        }
                    </>
                )
                : ''
            }
            {signInError &&
                <Alert variant='warning'>
                    {signInError.message}
                </Alert>
            }
            {error &&
                <Alert variant='warning'>
                    {error.message}
                </Alert>
            }
        </div>
    );
};

const mapStateToProps = state => ({
    walletAddress: walletAddress(state),
    web3ProviderType: web3ProviderType(state),
    signInError: signInError(state)
});

const mapDispatchToProps = {
    openPortis
};

export default connect(mapStateToProps, mapDispatchToProps)(CryptoPaymentPage);
