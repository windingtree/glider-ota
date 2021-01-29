import MetaMaskOnboarding from '@metamask/onboarding';
import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {Spinner} from 'react-bootstrap';
import styles from './crypto.module.scss';
import MetamaskIcon from '../../assets/metamask.png';

import {isLoggedIn, isSigningIn, logOutRequest, signInRequest, web3ProviderType} from '../../redux/sagas/web3';

const ONBOARD_TEXT = 'Install MetaMask';
const CONNECT_TEXT = 'Connect MetaMask';
const LOGOUT_TEXT = 'LogOut MetaMask';

const MetamaskButton = props => {
    const {
        exclusive,
        noLogout,
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

    if ((exclusive && loggedIn && web3ProviderType !== 'metamask') ||
        (loggedIn && noLogout)) {
        return null;
    }

    return (
        <button
            onClick={handleClick}
            className={styles.connectButton}
            disabled={isSigningIn || (loggedIn && web3ProviderType !== 'metamask')}
        >
            <img
                src={MetamaskIcon}
                width='18px'
                height='18px'
                alt={'MetaMask'}
                className={styles.iconLeft}
            />
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
        </button>
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
