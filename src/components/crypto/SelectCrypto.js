import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Table, Row, Col, Badge, Button, Spinner } from 'react-bootstrap';
import styles from './crypto.module.scss';

import {
    tokens,
    UNISWAP_ROUTER_ADDRESS
} from '../../config/default';
import {
    getTokenBalance,
    getTokenAllowance,
    parseTokenValue
} from '../../utils/web3-utils';

import {
    web3,
    isLoggedIn,
    walletAddress
} from '../../redux/sagas/web3';

const tokensPoller = (web3, walletAddress, tokens, loadingCallback, updateCallback, usdValue) => {
    loadingCallback(true);
    let list = JSON.parse(JSON.stringify(tokens));
    let isActive = true;

    const fetchTargetValue = async (coin, value) => {
        return '10000000000000000000'; // @todo Add conversion logic
    };

    const updateTokensList = async list => {
        try {
            const amountsList = await Promise.all(
                list.map(
                    coin => fetchTargetValue(
                        coin,
                        usdValue
                    )
                )
            );
            const balanceList = await Promise.all(
                list.map(
                    coin => getTokenBalance(
                        web3,
                        coin.address,
                        walletAddress
                    )
                )
            );
            const allowanceList = await Promise.all(
                list.map(
                    coin => getTokenAllowance(
                        web3,
                        coin.address,
                        walletAddress,
                        UNISWAP_ROUTER_ADDRESS
                    )
                )
            );
            list = list.map(
                (coin, index) => ({
                    ...coin,
                    balance: parseTokenValue(web3, balanceList[index], coin.decimals),
                    allowance: parseTokenValue(web3, allowanceList[index], coin.decimals),
                    value: parseTokenValue(web3, amountsList[index], coin.decimals)
                })
            );
            updateCallback(list);
            loadingCallback(false);
        } catch (error) {
            console.log(error);
        }
    };

    setTimeout(async () => {
        try {
            while (isActive) {
                updateTokensList(list);
                await new Promise(resolve => setTimeout(resolve, 3000)); // Pause for 3 sec
            };
        } catch (error) {
            console.log(error);
        }
    });

    return () => {
        isActive = false;
    };
};

const SelectCrypto = props => {
    const {
        web3,
        loggedIn,
        walletAddress,
        title,
        usdValue
    } = props;
    const [tokesLoading, setTokensLoading] = useState(true);
    const [tokensDetails, setTokensDetails] = useState([]);

    useEffect(() => {
        const stopPoller = tokensPoller(
            web3,
            walletAddress,
            tokens,
            setTokensLoading,
            setTokensDetails,
            usdValue
        );
        return () => stopPoller();
    }, [web3, walletAddress, usdValue]);

    if (!loggedIn) {
        return null;
    }

    return (
        <>
            <h2>{title}</h2>
            {tokesLoading &&
                <>
                    Loading...
                    <Spinner
                        className={styles.buttonSpinner}
                        animation="border"
                        role="status"
                        aria-hidden="true"
                    />
                </>
            }
            {!tokesLoading &&
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Balance</th>
                            <th>Amount</th>
                            <th>Allowance</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tokensDetails.map((coin, i) => (
                        <tr
                            key={i}
                        >
                            <td>
                                <img
                                    className={styles.tokenIcon}
                                    alt={coin.name}
                                    src={coin.logoURI}
                                />
                                <span className={styles.tokenLabel}>
                                    {coin.symbol}
                                </span>
                            </td>
                            <td>
                                {coin.balance}
                            </td>
                            <td>
                                {coin.value}
                            </td>
                            <td>
                                {coin.allowance}
                            </td>
                            <td>
                                <Button
                                    size="sm"
                                >
                                    Action
                                    <Spinner
                                        className={styles.buttonSpinner}
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            }
        </>
    );
};

const mapStateToProps = state => ({
    web3: web3(state),
    loggedIn: isLoggedIn(state),
    walletAddress: walletAddress(state)
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCrypto);
