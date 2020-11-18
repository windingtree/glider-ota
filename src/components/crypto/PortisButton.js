import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';
import styles from './crypto.module.scss';

import {
    signInRequest,
    logOutRequest,
    isSigningIn,
    isLoggedIn,
    web3ProviderType
} from '../../redux/sagas/web3';

const CONNECT_TEXT = 'Connect Portis';
const LOGOUT_TEXT = 'LogOut Portis';

const PortisButton = props => {
    const {
        exclusive,
        signInRequest,
        logOutRequest,
        isSigningIn,
        loggedIn,
        web3ProviderType
    } = props;
    const [buttonText, setButtonText] = useState(CONNECT_TEXT);
    const [isStarted, setStarted] = useState(false);

    useEffect(() => {
        if (loggedIn) {
            setButtonText(LOGOUT_TEXT);
        }
         else {
            setButtonText(CONNECT_TEXT);
        }
        setStarted(false);
    }, [loggedIn]);

    const handleClick = () => {
        setStarted(true);
        if (!loggedIn) {
            signInRequest('portis')
        } else {
            logOutRequest();
        }
    };

    if (exclusive && loggedIn && web3ProviderType !== 'portis') {
        return null;
    }

    return (
        <Button
            size="sm"
            onClick={handleClick}
            className={styles.buttonLabel}
            disabled={isSigningIn || (loggedIn && web3ProviderType !== 'portis')}
        >
            <span>{buttonText}</span>
            {(isSigningIn && isStarted) &&
                <Spinner
                    className={styles.buttonSpinner}
                    animation="border"
                    as="span"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            }
        </Button>
    );
};

const mapStateToProps = state => ({
    isSigningIn: isSigningIn(state),
    loggedIn: isLoggedIn(state),
    web3ProviderType: web3ProviderType(state)
});

const mapDispatchToProps = {
    signInRequest,
    logOutRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(PortisButton);
