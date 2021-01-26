import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import styles from './crypto.module.scss';
import {
    walletAddress,
    web3ProviderType,
    openPortis,
    signInError
} from '../../redux/sagas/web3';

import MetamaskButton from './MetamaskButton';
import PortisButton from './PortisButton';
import SelectCrypto from './SelectCrypto';
import WalletAddress from './WalletAddress';

const CryptoPay = props => {
    const {
        walletAddress,
        signInError
    } = props;
    const usdValue = 1.3;

    return (
        <Container>
            <h1 className={styles.cryptoTitle}>
                Pay {usdValue} USD with Crypto
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
            {signInError &&
                <Alert variant='warning'>
                    {signInError.message}
                </Alert>
            }
            {walletAddress &&
                <SelectCrypto
                    title="Select a token"
                    usdValue={usdValue}
                    attachment={'offerId'}
                    deadline={Math.ceil(Date.now() / 1000) + (60*60*30)}
                />
            }
        </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(CryptoPay);
