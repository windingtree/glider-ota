import React from 'react';
import { connect } from 'react-redux';
import styles from './crypto.module.scss';
import {
    walletAddress,
    web3ProviderType,
    openPortis,
    signInError
} from '../../../redux/sagas/web3';
import CopyText from './CopyText';
import MetamaskIcon from '../../../assets/metamask.png';
import PortisIcon from '../../../assets/portis.png';

const getWalletAddress = providerType => {
    switch (providerType) {
        case 'metamask':
            return MetamaskIcon;
        case 'portis':
            return PortisIcon;
        default:
            return null;
    }
};

const WalletAccount = props => {
    const {
        walletAddress,
        web3ProviderType
    } = props;
    const icon = getWalletAddress(web3ProviderType);

    const handleAccountClick = () => {
        if (web3ProviderType === 'portis') {
            openPortis();
        }
    };

    if (!walletAddress) {
        return null;
    }

    return (
        <div
            className={styles.walletAddress}
            onClick={handleAccountClick}
        >
            <CopyText
                icon={icon}
                text={walletAddress}
                label={walletAddress}
                toastText='Wallet address copied to clipboard'
                ellipsis
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(WalletAccount);
