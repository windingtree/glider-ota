import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Badge, Button, Spinner } from 'react-bootstrap';
import styles from './crypto.module.scss';

import {
    isLoggedIn
} from '../../redux/sagas/web3';

const cryptoList = [
    {
        name: 'ETH'
    },
    {
        name: 'LIF'
    },
    {
        name: 'DAI'
    }
];

const applyAmounts = (list = [], amounts = {}) => list
    .map(coin => {
        if (amounts[coin.name]) {
            return {
                ...coin,
                value: amounts[coin.name]
            };
        } else {
            return null;
        }
    })
    .filter(coin => coin !== null);

const SelectCrypto = props => {
    const {
        loggedIn,
        amounts
    } = props;
    const [crypto, setCrypto] = useState([]);

    useEffect(() => {
        setCrypto(applyAmounts(cryptoList, amounts));
    }, [amounts]);

    if (!loggedIn) {
        return null;
    }

    return (
        <Container
            className={styles.cryptoListWrapper}
        >
            {crypto.map((coin, i) => (
                <Row
                    key={i}
                    className={styles.cryptoListRow}
                >
                    <Col xs="1">
                        <Badge
                            variant="primary"
                        >
                            {coin.name}
                        </Badge>
                    </Col>
                    <Col>
                        {coin.value}
                    </Col>
                    <Col xs="1">
                        <Spinner
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    </Col>
                    <Col xs="2">
                        <Button
                            size="sm"
                        >
                            Action
                        </Button>
                    </Col>
                </Row>
            ))}
        </Container>
    );
};

const mapStateToProps = state => ({
    loggedIn: isLoggedIn(state)
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCrypto);
