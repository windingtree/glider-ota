import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Alert } from 'react-bootstrap';
import Header from '../components/common/header/header';
import { useHistory, useParams } from "react-router-dom";
import SelectCrypto from '../components/crypto/SelectCrypto';
import MetamaskButton from '../components/crypto/MetamaskButton';
import PortisButton from '../components/crypto/PortisButton';
import WalletAddress from '../components/crypto/WalletAddress';
import Footer from "../components/common/footer/footer";
import styles from '../components/crypto//crypto.module.scss';
import Spinner from "../../src/components/common/spinner"
import {
    walletAddress,
    web3ProviderType,
    openPortis,
    signInError
} from '../redux/sagas/web3';
import { createPaymentIntent } from "../../src/utils/api-utils";


const CryptoPaymentPage = props => {
    const {
        walletAddress,
        signInError
    } = props;
    const {
        confirmedOfferId
    } = useParams();
    const history = useHistory();
    const [error, setError] = useState(null);
    const [isOfferLoading, setOfferLoading] = useState(false);
    const [offer, setOffer] = useState(null);

    const handlePaymentSuccess = hash => {
        const url=`/confirmation/${confirmedOfferId}/${hash}`;
        history.push(url);
    }

    useEffect(()=>{
        setOfferLoading(true);
        createPaymentIntent(confirmedOfferId, "crypto")
            .then(data => {
                console.log(data);
                setOffer(data.offer);
                setOfferLoading(false);
            })
            .catch(err => {
                setError(err);
                setOfferLoading(false);
            });
    },[confirmedOfferId])

    return (
        <div>
            <Header violet={true}/>
            <div className='root-container-subpages'>
                {isOfferLoading &&
                    <Spinner enabled={true}/>
                }
                {(!isOfferLoading && !error && offer) &&
                    <>
                        <h1 className={styles.cryptoTitle}>
                            Pay {offer.price.public} {offer.price.currency} with Crypto
                        </h1>
                        <WalletAddress />
                        <Row className={styles.mb10}>
                            <Col>
                                <MetamaskButton exclusive />
                            </Col>
                        </Row>
                        <Row className={styles.mb10}>
                            <Col>
                                <PortisButton exclusive />
                            </Col>
                        </Row>
                        {walletAddress &&
                            <SelectCrypto
                                title='Select a token'
                                usdValue={offer.price.public}
                                attachment={confirmedOfferId}
                                deadline={Math.ceil(Date.now() / 1000) + (60*60*30)}
                                onPaymentSuccess={handlePaymentSuccess}
                            />
                        }
                    </>
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
            <Footer/>
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