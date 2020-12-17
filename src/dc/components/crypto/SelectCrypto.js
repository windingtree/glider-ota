import Web3 from 'web3';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button, Spinner as RoundSpinner, Alert } from 'react-bootstrap';
import Spinner from '../../components/common/spinner';
import {
    createCryptoOrder
} from '../../../utils/api-utils';
import styles from './crypto.module.scss';

import {
    tokens,
    PAYMENT_MANAGER_ADDRESS
} from '../../../config/default';
import {
    getTokenBalance,
    getTokenAllowance,
    parseTokenValue,
    getStableCoinValue,
    getAmountIn,
    approveToken,
    payWithToken,
    payWithETH
} from '../../../utils/web3-utils';

import {
    web3,
    isLoggedIn,
    walletAddress
} from '../../../redux/sagas/web3';
import {
    minedTx,
    txErrors,
    txRegister,
    invalidateTxErrors
} from '../../../redux/sagas/tx';
import CopyText from './CopyText';

const toBN = Web3.utils.toBN;

const CryptoCard = props => {
    const {
        coin,
        value,
        attachment,
        deadline,
        selectedCoin,
        onSelected,
        onError,
        onProcessing,
        onPaymentStart,
        onPayment,
        web3,
        walletAddress,
        disabled
    } = props;
    const [selected, setSelected] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (
            coin && selectedCoin &&
            (coin.address !== selectedCoin.address ||
            coin.symbol !== selectedCoin.symbol)
        ) {
            setSelected(false);
        }
    }, [coin, selectedCoin]);

    const handleProcessing = processing => {
        setIsProcessing(processing);
        onProcessing(processing);
    };

    const handleCardClick = () => {
        if (disabled) {
            return;
        }
        if (!coin.insufficientLiquidity) {
            setSelected(!selected);
            onSelected(coin);
        }
    };

    const handleApprove = async coin => {
        if (disabled) {
            return;
        }
        try {
            handleProcessing(true);
            await approveToken(
                web3,
                coin.address,
                walletAddress,
                PAYMENT_MANAGER_ADDRESS,
                coin.rawBalance
            );
            handleProcessing(false);
        } catch (error) {
            console.log(error);
            onError(error);
            handleProcessing(false);
        }
    };

    const handlePay = async coin => {
        if (disabled) {
            return;
        }
        try {
            handleProcessing(true);
            const stableCoinValue = await getStableCoinValue(web3, value);

            onPaymentStart(coin);

            // throw new Error('TEST ERROR');

            let paymentReceipt;

            if (coin.ether) {
                paymentReceipt = await payWithETH(
                    web3,
                    stableCoinValue,
                    coin.rawAmount,
                    String(deadline),
                    attachment,
                    walletAddress
                );
            } else {
                paymentReceipt = await payWithToken(
                    web3,
                    stableCoinValue,
                    coin.rawAmount,
                    coin.address,
                    String(deadline),
                    attachment,
                    walletAddress
                );
            }

            handleProcessing(false);
            onPayment(paymentReceipt);
        } catch (error) {
            console.log(error);
            onError(error);
            handleProcessing(false);
        }
    };

    return (
        <Container fluid className={[
            styles.cryptoCardWrapper,
            (coin.insufficientLiquidity ? styles.disabled : '')
        ].join(' ')}>
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
                {/* <Col className={styles.xsHide}>
                    <div className={styles.tokenDataText}>
                        {selected ? 'Allowance' : coin.allowance}
                    </div>
                </Col> */}
                {coin.insufficientLiquidity &&
                    <Col xs='auto' sm='4' className={styles.xsHide}>
                        <div className={styles.amountWrapper + ` ${styles.noLiquidity}`}>
                            Insufficient Token Liquidity
                        </div>
                    </Col>
                }
                {!coin.insufficientLiquidity &&
                    <Col xs='auto' sm='4'>
                        <div className={[
                            styles.amountWrapper,
                            (selected ? styles.selected : ''),
                            (coin.balance < coin.amount ? styles.red : ''),
                            (coin.insufficientLiquidity ? styles.noLiquidity: '')
                        ].join(' ')}>
                            {coin.amount}
                        </div>
                    </Col>
                }
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
                        {/* <Col>
                            <div className={styles.tokenDataText}>
                                {'Allowance'}
                            </div>
                        </Col> */}
                    </Row>
                    <Row className={styles.xsShow}>
                        <Col>
                            <div className={styles.tokenDataText}>
                                {coin.balance}
                            </div>
                        </Col>
                        {/* <Col>
                            <div className={styles.tokenDataText}>
                                {coin.allowance}
                            </div>
                        </Col> */}
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
                        {/* <Col className={styles.xsHide}>
                            <div className={styles.tokenDataText}>
                                {coin.allowance}
                            </div>
                        </Col> */}
                        <Col xs={12} sm='4'>
                            <div className={styles.actionWrapper}>
                                {(coin.balance >= coin.amount && coin.allowance < coin.amount) &&
                                    <Button
                                        className={styles.xsBlock}
                                        size='sm'
                                        onClick={() => handleApprove(coin)}
                                        disabled={isProcessing}
                                    >
                                        Unlock
                                        {isProcessing &&
                                            <RoundSpinner
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
                                        className={styles.xsBlock}
                                        size="sm"
                                        onClick={() => handlePay(coin)}
                                        disabled={!selectedCoin || isProcessing}
                                    >
                                        Pay
                                        {isProcessing &&
                                            <RoundSpinner
                                                className={styles.buttonSpinner}
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        }
                                    </Button>
                                }
                                {(!coin.insufficientLiquidity && coin.balance < coin.amount) &&
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

    const fetchAmount = async (coinAddress, coinDecimals, usdValue, withSlippage = true) => {
        try {
            // Get Uniswap estimation
            let amount = await getAmountIn(web3, usdValue, coinAddress);
            // Add Slippage tolerance 1%
            if (withSlippage) {
                amount = toBN(amount).add(toBN(amount).div(toBN(100))).toString();
            }
            return [
                parseTokenValue(web3, amount, coinDecimals, true, 6),
                amount
            ];
        } catch (error) {
            // console.log(error);
            return [];
        }
    };

    const updateTokensList = async list => {
        list = await Promise.all(
            list.map(
                async coin => {
                    try {
                        let balance = 0;
                        let allowance = 0;
                        let amount = 0;
                        let rawAmount = '0';
                        let insufficientLiquidity = false;

                        if (coin.ether) {
                            balance = await web3.eth.getBalance(walletAddress);
                            allowance = balance;
                        } else {
                            balance = await getTokenBalance(
                                web3,
                                coin.address,
                                walletAddress
                            );
                            allowance = await getTokenAllowance(
                                web3,
                                coin.address,
                                walletAddress,
                                PAYMENT_MANAGER_ADDRESS
                            );
                        }

                        const amounts = await fetchAmount(
                            coin.address,
                            coin.decimals,
                            usdValue,
                            !coin.ether
                        );

                        amount = amounts[0];
                        rawAmount = amounts[1];

                        if (amount === undefined) {
                            insufficientLiquidity = true;
                        }

                        return {
                            ...coin,
                            insufficientLiquidity,
                            rawBalance: balance,
                            balance: parseTokenValue(web3, balance, coin.decimals, true, 6),
                            allowance: parseTokenValue(web3, allowance, coin.decimals, true, 6),
                            amount,
                            rawAmount
                        };
                    } catch (error) {
                        console.log(error);
                        return null;
                    }
                }
            )
        );
        updateCallback(list.filter(t => t !== null));
        loadingCallback(false);
    };

    setTimeout(async () => {
        try {
            console.log('Poller start!');
            while (isActive) {
                updateTokensList(list);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Pause for 3 sec
            };
        } catch (error) {
            console.log(error);
        }
    });

    return () => {
        isActive = false;
        console.log('Poller stop!');
    };
};

const SelectCrypto = props => {
    const {
        web3,
        loggedIn,
        walletAddress,
        title,
        usdValue,
        confirmedOfferId,
        deadline,
        onPaymentReset,
        onPaymentStart,
        onPaymentSuccess,
        onPaymentError,
        minedTx,
        txErrors,
        txRegister,
        invalidateTxErrors
    } = props;
    const [error, setError] = useState(null);
    const [tokesLoading, setTokensLoading] = useState(true);
    const [tokensDetails, setTokensDetails] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [paymentHash, setPaymentHash] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderProcessing, setOrderProcessing] = useState(false);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (!isProcessing && walletAddress) {
            const stopPoller = tokensPoller(
                web3,
                walletAddress,
                tokens,
                setTokensLoading,
                setTokensDetails,
                usdValue
            );
            return () => stopPoller();
        }
    }, [web3, walletAddress, usdValue, isProcessing]);

    const handleErrorsDismiss = () => {
        setError(null);
        onPaymentReset();
    };

    const handleTxErrorsDismiss = () => {
        invalidateTxErrors();
    };

    const showPaymentSuccess = receipt => {
        setPaymentHash(receipt.transactionHash);
        setOrderProcessing(true);
        // Create an order
        createCryptoOrder(confirmedOfferId, receipt.transactionHash)
            .then(data => {
                setOrder(data);
                setOrderProcessing(false);
                onPaymentSuccess();
            })
            .catch(error => {
                console.log(error);
                setError(error);
                setOrderProcessing(false);
                onPaymentError(error);
            });
    };

    if (!loggedIn) {
        return null;
    }

    return (
        <>
            {(!error && !paymentHash) &&
                <>
                    <p className={styles.topNote}>
                        Your final paid amount might change depending on real-time conversion rate. The transaction will be reverted if the price increases by more than 1%
                    </p>
                    <h2 className={styles.selectorTitle}>{title}</h2>
                    <Spinner
                        enabled={tokesLoading && tokensDetails.length === 0}
                    />
                    {tokensDetails.length > 0 &&
                        tokensDetails.map((coin, i) => (
                            <CryptoCard
                                key={i}
                                coin={coin}
                                value={usdValue}
                                attachment={confirmedOfferId}
                                deadline={deadline}
                                selectedCoin={selectedCoin}
                                onSelected={setSelectedCoin}
                                onError={setError}
                                onProcessing={setIsProcessing}
                                onPaymentStart={onPaymentStart}
                                onPayment={showPaymentSuccess}
                                web3={web3}
                                walletAddress={walletAddress}
                                minedTx={minedTx}
                                txRegister={txRegister}
                                disabled={isProcessing}
                            />
                        ))
                    }
                </>
            }
            {paymentHash &&
                <div>
                    <p className={styles.paymentSuccess}>
                        Payment has been successfully done.<br/>
                        Transaction:&nbsp;
                        <CopyText
                            className={styles.paymentTx}
                            text={paymentHash}
                            label={paymentHash}
                            toastText='Transaction hash copied to clipboard'
                            ellipsis
                        />
                    </p>
                    {orderProcessing &&
                        <>
                            <p>Processing an order...</p>
                            <Spinner
                                enabled={true}
                            />
                        </>
                    }
                    {/* {order &&
                        <Button
                            className={styles.xsBlock}
                            size='lg'
                            onClick={onPaymentSuccess}
                        >
                            Continue
                        </Button>
                    } */}
                </div>
            }
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
                    <Button size='sm' onClick={handleErrorsDismiss}>
                        Back to Payment
                    </Button>
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
