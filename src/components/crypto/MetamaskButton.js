import MetaMaskOnboarding from '@metamask/onboarding';
import React, { useEffect, useState, useRef } from 'react';
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

const ONBOARD_TEXT = 'Install MetaMask';
const CONNECT_TEXT = 'Connect MetaMask';
const LOGOUT_TEXT = 'LogOut MetaMask';

const MetamaskButton = props => {
    const {
        exclusive,
        signInRequest,
        logOutRequest,
        isSigningIn,
        loggedIn,
        web3ProviderType
    } = props;
    const [buttonText, setButtonText] = useState(ONBOARD_TEXT);
    const [isStarted, setStarted] = useState(false);
    const onboarding = useRef();

    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    useEffect(() => {
        const installed = MetaMaskOnboarding.isMetaMaskInstalled();
        if (installed && !loggedIn) {
            setButtonText(CONNECT_TEXT);
        } else if (installed && loggedIn) {
            setButtonText(LOGOUT_TEXT);
        }
         else {
            setButtonText(ONBOARD_TEXT);
        }
        setStarted(false);
    }, [loggedIn]);

    const handleClick = () => {
        setStarted(true);
        const installed = MetaMaskOnboarding.isMetaMaskInstalled();
        if (installed && !loggedIn) {
            signInRequest('metamask')
        } else if (installed && loggedIn) {
            logOutRequest();
        } else {
            onboarding.current.startOnboarding();
        }
    };

    if (exclusive && loggedIn && web3ProviderType !== 'metamask') {
        return null;
    }

    return (
        <Button
            onClick={handleClick}
            className={styles.buttonLabel}
            disabled={isSigningIn || (loggedIn && web3ProviderType !== 'metamask')}
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

export default connect(mapStateToProps, mapDispatchToProps)(MetamaskButton);
