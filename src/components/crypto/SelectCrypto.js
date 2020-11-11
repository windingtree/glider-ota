import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Table, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import styles from './crypto.module.scss';

import {
    tokens,
    UNISWAP_ROUTER_ADDRESS,
    BASE_PRICE_TOKEN
} from '../../config/default';
import {
    getTokenBalance,
    getTokenAllowance,
    parseTokenValue,
    rawTokenValue,
    createErc20Contract,
    createUniswapRouterContract,
    approveToken
} from '../../utils/web3-utils';

import {
    web3,
    isLoggedIn,
    walletAddress
} from '../../redux/sagas/web3';
import {
    minedTx,
    txErrors,
    txRegister,
    invalidateTxErrors
} from '../../redux/sagas/tx';

const CryptoCard = props => {
    const {
        coin,
        selectedCoin,
        onSelected,
        onError,
        web3,
        walletAddress,
        minedTx,
        txRegister
    } = props;
    const [selected, setSelected] = useState(false);
    const [coinProcessingHash, setCoinProcessingHash] = useState(null);

    useEffect(() => {
        if (coin && selectedCoin && coin.address !== selectedCoin.address) {
            setSelected(false);
        }
    }, [coin, selectedCoin]);

    useEffect(() => {
        if (minedTx[coinProcessingHash]) {
            setTimeout(() => {
                setCoinProcessingHash(false)
            }, 2000);
        }
    }, [coinProcessingHash, minedTx]);

    const handleCardClick = () => {
        setSelected(!selected);
        onSelected(coin);
    };

    const handleApprove = async coin => {
        try {
            setCoinProcessingHash(true);
            const hash = await approveToken(
                web3,
                coin.address,
                walletAddress,
                UNISWAP_ROUTER_ADDRESS,
                coin.rawAmount
            );
            txRegister(hash);
            setCoinProcessingHash(hash);
        } catch (error) {
            console.log(error);
            onError(error);
            setCoinProcessingHash(null);
        }
    };

    return (
        <Container fluid className={styles.cryptoCardWrapper}>
            <Row
                onClick={handleCardClick}
            >
                <Col>
                    <div className={styles.tokenDataText}>
                        <img
                            className={styles.tokenIcon}
                            alt={coin.name}
                            src={coin.logoURI}
                        />
                        <span className={styles.tokenLabel}>
                            {coin.symbol}
                        </span>
                    </div>
                </Col>
                <Col className={styles.xsHide}>
                    <div className={styles.tokenDataText}>
                        {selected ? 'Balance' : coin.balance}
                    </div>
                </Col>
                <Col className={styles.xsHide}>
                    <div className={styles.tokenDataText}>
                        {selected ? 'Allowance' : coin.allowance}
                    </div>
                </Col>
                <Col xs='auto' sm='4'>
                    <div className={[
                        styles.amountWrapper,
                        (selected ? styles.selected : ''),
                        (coin.balance < coin.amount ? styles.red : '')
                    ].join(' ')}>
                        {coin.amount}
                    </div>
                </Col>
            </Row>
            {!selected &&
                <Row className={styles.xsShow}>
                    <Col>
                        <div className={styles.tokenDataText}>
                            {coin.balance}
                        </div>
                    </Col>
                </Row>
            }
            {selected &&
                <>
                    <Row className={[
                        styles.xsShow,
                        styles.mt10
                    ].join(' ')}>
                        <Col>
                            <div className={styles.tokenDataText}>
                                {'Balance'}
                            </div>
                        </Col>
                        <Col>
                            <div className={styles.tokenDataText}>
                                {'Allowance'}
                            </div>
                        </Col>
                    </Row>
                    <Row className={styles.xsShow}>
                        <Col>
                            <div className={styles.tokenDataText}>
                                {coin.balance}
                            </div>
                        </Col>
                        <Col>
                            <div className={styles.tokenDataText}>
                                {coin.allowance}
                            </div>
                        </Col>
                    </Row>
                    <Row className={styles.actionRow}>
                        <Col className={styles.xsHide}>
                            &nbsp;
                        </Col>
                        <Col className={styles.xsHide}>
                            <div className={styles.tokenDataText}>
                                {coin.balance}
                            </div>
                        </Col>
                        <Col className={styles.xsHide}>
                            <div className={styles.tokenDataText}>
                                {coin.allowance}
                            </div>

                        </Col>
                        <Col xs={12} sm='4'>
                            <div className={styles.actionWrapper}>
                                {(coin.balance >= coin.amount && coin.allowance < coin.amount) &&
                                    <Button
                                        className={styles.xsBlock}
                                        size='sm'
                                        onClick={() => handleApprove(coin)}
                                        disabled={coinProcessingHash}
                                    >
                                        Unlock
                                        {coinProcessingHash &&
                                            <Spinner
                                                className={styles.buttonSpinner}
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        }
                                    </Button>
                                }
                                {(coin.balance >= coin.amount && coin.allowance >= coin.amount) &&
                                    <Button
                                        size="sm"
                                        onClick={() => {}}
                                        disabled={!selectedCoin || coinProcessingHash}
                                    >
                                        Pay
                                    </Button>
                                }
                                {coin.balance < coin.amount &&
                                    <span className={styles.actionNote}>
                                        Insufficient funds
                                    </span>
                                }
                            </div>
                        </Col>
                    </Row>
                </>
            }
        </Container>
    );
};

const tokensPoller = (web3, walletAddress, tokens, loadingCallback, updateCallback, usdValue) => {
    loadingCallback(true);
    usdValue = String(usdValue);

    let list = JSON.parse(JSON.stringify(tokens));
    let isActive = true;

    const fetchAmount = async (coinAddress, value) => {
        const targetToken = createErc20Contract(web3, BASE_PRICE_TOKEN);
        const targetTokenDecimals = await targetToken.methods['decimals()']().call();
        const targetTokenValue = rawTokenValue(web3, value, targetTokenDecimals);
        let amount;
        if (coinAddress === BASE_PRICE_TOKEN) {
            amount = targetTokenValue;
        } else {
            const uniswapRouter = createUniswapRouterContract(web3);
            const wethAddress = await uniswapRouter.methods['WETH()']().call();
            let path;
            if (coinAddress === wethAddress) {
                path = [
                    coinAddress,
                    BASE_PRICE_TOKEN
                ];
            } else {
                path = [
                    coinAddress,
                    wethAddress,
                    BASE_PRICE_TOKEN
                ];
            }
            amount = (await uniswapRouter
                .methods['getAmountsIn(uint256,address[])'](
                    targetTokenValue,
                    path
                )
                .call())[0];
        }

        return [
            parseTokenValue(web3, amount, targetTokenDecimals, true, 6),
            amount
        ];
    };

    const updateTokensList = async list => {
        try {
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
            const amountsList = await Promise.all(
                list.map(
                    coin => fetchAmount(
                        coin.address,
                        usdValue
                    )
                )
            );
            list = list.map(
                (coin, index) => ({
                    ...coin,
                    balance: parseTokenValue(web3, balanceList[index], coin.decimals, true, 6),
                    allowance: parseTokenValue(web3, allowanceList[index], coin.decimals, true, 6),
                    amount: amountsList[index][0],
                    rawAmount: amountsList[index][1]
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
        usdValue,
        minedTx,
        txErrors,
        txRegister,
        invalidateTxErrors
    } = props;
    const [error, setError] = useState(null);
    const [tokesLoading, setTokensLoading] = useState(true);
    const [tokensDetails, setTokensDetails] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);

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

    const handleErrorsDismiss = () => {
        setError(null);
    };

    const handleTxErrorsDismiss = () => {
        invalidateTxErrors();
    };

    if (!loggedIn) {
        return null;
    }

    return (
        <>
            <h2 className={styles.selectorTitle}>{title}</h2>
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
                tokensDetails.map((coin, i) => (
                    <CryptoCard
                        key={i}
                        coin={coin}
                        selectedCoin={selectedCoin}
                        onSelected={setSelectedCoin}
                        onError={setError}
                        web3={web3}
                        walletAddress={walletAddress}
                        minedTx={minedTx}
                        txRegister={txRegister}
                    />
                ))
            }
            {/* {!tokesLoading &&
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
                                {coin.amount}
                            </td>
                            <td>
                                {coin.allowance}
                            </td>
                            <td>
                                {(coin.balance >= coin.amount && coin.allowance < coin.amount) &&
                                    <Button
                                        size="sm"
                                        onClick={() => handleApprove(coin)}
                                        disabled={coinsProcessing[coin.address] && coinsProcessing[coin.address].processing}
                                    >
                                        Approve
                                        {(coinsProcessing[coin.address] && coinsProcessing[coin.address].processing) &&
                                            <Spinner
                                                className={styles.buttonSpinner}
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        }
                                    </Button>
                                }
                                {(coin.balance >= coin.amount && coin.allowance >= coin.amount) &&
                                    <Button
                                        size="sm"
                                        onClick={() => handleSelect(coin)}
                                        disabled={selectedCoin && coin.address === selectedCoin.address}
                                    >
                                        Select
                                    </Button>
                                }
                                {(coin.balance < coin.amount) &&
                                    <p className={styles.tokenComment}>
                                        Insufficient funds
                                    </p>
                                }
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            } */}
            {error &&
                <Alert
                    dismissible
                    variant="danger"
                    onClose={handleErrorsDismiss}
                >
                    <Alert.Heading>Error</Alert.Heading>
                    <p>
                        {error.message}
                    </p>
                </Alert>
            }
            {Object.keys(txErrors).length > 0 &&
                <Alert
                    dismissible
                    variant="danger"
                    onClose={handleTxErrorsDismiss}
                >
                    <Alert.Heading>Transaction Error!</Alert.Heading>
                    {Object.entries(txErrors).map((err, i) => (
                        <p key={i}>
                            {err[1].message}
                        </p>
                    ))}
                </Alert>
            }
        </>
    );
};

const mapStateToProps = state => ({
    web3: web3(state),
    loggedIn: isLoggedIn(state),
    walletAddress: walletAddress(state),
    minedTx: minedTx(state),
    txErrors: txErrors(state)
});

const mapDispatchToProps = {
    txRegister,
    invalidateTxErrors
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCrypto);
