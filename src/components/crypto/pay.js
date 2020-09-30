import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Badge, Alert } from 'react-bootstrap';
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

const CryptoPay = props => {
    const {
        walletAddress,
        openPortis,
        web3ProviderType,
        signInError
    } = props;

    const handleAccountClick = () => {
        if (web3ProviderType === 'portis') {
            openPortis();
        }
    };

    return (
        <Container>
            <h1 className={styles.cryptoTitle}>
                Pay with Crypto&nbsp;
                {walletAddress &&
                    <Badge
                        variant="info"
                        className={styles.walletAddress}
                        onClick={handleAccountClick}
                    >
                        {walletAddress}
                    </Badge>
                }
            </h1>
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
                    title="Select Currency"
                    usdValue={100}
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
