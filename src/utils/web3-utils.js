import erc20abi from '../config/erc20abi.json';
import IUniswapV2Router02 from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import {
    UNISWAP_ROUTER_ADDRESS,
    GLIDER_ORGID,
    PAYMENT_MANAGER_ADDRESS
} from '../config/default';
const {
    PaymentManagerContract
} = require('@windingtree/payment-manager');

// Converts network Id to the name format
export const networkIdParser = id => {
    id = parseInt(id);
    switch (id) {
        case 1:
            return 'mainnet';
        case 3:
            return 'ropsten';
        case 4:
            return 'rinkeby';
        case 5:
            return 'goerli';
        case 42:
            return 'kovan';
        default:
            throw new Error('Unknown network Id');
    }
};

// Returns network Id by the name
export const networkIdByName = (name, returnHex = false) => {
    let id;
    switch (name) {
        case 'mainnet':
            id = 1;
            break;
        case 'ropsten':
            id = 3;
            break;
        case 'rinkeby':
            id = 4;
            break;
        case 'goerli':
            id = 5;
            break;
        case 'kovan':
            id = 42;
            break;
        default:
            throw new Error('Unknown network Id');
    }

    return returnHex ? `0x${id.toString(16)}` : id;
};

// Return inverted unitMap
export const mappedUnits = web3 => Object
    .entries(web3.utils.unitMap)
    .reduce((a,v) => ({...a, [v[1]]: v[0]}), {});

// Timeout helper for Promise
const setTimeoutPromise = timeout => new Promise(resolve => setTimeout(resolve, timeout));

// Get block
export const getBlock = async (web3, typeOrNumber = 'latest', checkEmptyBlocks = true) => {
let counter = 0;
let block;

const isEmpty = block => checkEmptyBlocks
    ? block.transactions.length === 0
    : false;

const blockRequest = () => new Promise(resolve => {
    const blockNumberTimeout = setTimeout(() => resolve(null), 2000);
    try {
    web3.eth.getBlock(typeOrNumber, (error, result) => {
        clearTimeout(blockNumberTimeout);

        if (error) {
            return resolve();
        }

        resolve(result);
    });
    } catch (error) {
        // ignore errors due because of we will be doing retries
        resolve(null);
    }
});

do {
    const isConnected = () => typeof web3.currentProvider.isConnected === 'function'
    ? web3.currentProvider.isConnected()
    : web3.currentProvider.connected;
    if (!isConnected()) {
    throw new Error(`Unable to fetch block "${typeOrNumber}": no connection`);
    }

    if (counter === 100) {
        counter = 0;
        throw new Error(
        `Unable to fetch block "${typeOrNumber}": retries limit has been reached`
        );
    }

    block = await blockRequest();
    console.log('>>>', counter, block.hash);

    if (!block) {
        await setTimeoutPromise(parseInt(3000 + 1000 * counter / 5));
    } else {
    await setTimeoutPromise(2500);
    }

    counter++;
} while (!block || isEmpty(block));

return block;
};

// Create a smart contract object
export const createContract = (web3, abi, address) => new web3.eth.Contract(
    abi,
    address
);

// Create ERC20 contract object
export const createErc20Contract = (web3, address) => createContract(
    web3,
    erc20abi,
    address
);

// Create Uniswap Router contract
export const createUniswapRouterContract = web3 => createContract(
    web3,
    IUniswapV2Router02.abi,
    UNISWAP_ROUTER_ADDRESS
);

// Create PaymentManager contract
export const createPaymentManagerContract = web3 => createContract(
    web3,
    PaymentManagerContract.abi,
    PAYMENT_MANAGER_ADDRESS
);

// Get ETH balance
export const getEthBalance = (web3, address) => web3.eth.getBalance(address);

// Get Token balance
export const getTokenBalance = (web3, tokenAddress, ownerAddress) => {
    const token = createErc20Contract(web3, tokenAddress);
    return token.methods['balanceOf(address)'](ownerAddress).call();
};

// Get Token allowance
export const getTokenAllowance = (web3, tokenAddress, ownerAddress, spenderAddress) => {
    const token = createErc20Contract(web3, tokenAddress);
    return token.methods['allowance(address,address)'](ownerAddress, spenderAddress).call();
};

// Normalize token value by decimals
export const parseTokenValue = (web3, value, decimals, asNumber, fractionalLength) => {
    const units = mappedUnits(web3);
    let parsedValue = web3.utils
        .fromWei(
            value,
            units[Math.pow(10, decimals)]
        );
    if (fractionalLength) {
        const splitted = parsedValue.split('.');
        parsedValue = `${splitted[0]}${splitted[1] ? '.' + splitted[1].substr(0, fractionalLength) : ''}`;
    }
    return asNumber ? Number(parsedValue) : parsedValue;
};

// Returns raw token value
export const rawTokenValue = (web3, value, decimals) => web3.utils
    .toWei(
        String(value),
        mappedUnits(web3)[Math.pow(10, decimals)]
    );

// Convert usd value into stablecoin raw value
export const getStableCoinValue = async (web3, usdValue) => {
    const paymentManagerContract = createPaymentManagerContract(web3);
    const stableCoinAddress = await paymentManagerContract.methods.stableCoin().call();
    const stableCoinContract = createErc20Contract(web3, stableCoinAddress);
    const stableCoinDecimals = await stableCoinContract.methods.decimals().call();
    return rawTokenValue(web3, usdValue, stableCoinDecimals);
};

// Get amount of token to make a payment
export const getAmountIn = async (web3, usdValue, coinAddress) => {
    const paymentManagerContract = createPaymentManagerContract(web3);
    const stableCoinValue = await getStableCoinValue(web3, usdValue);
    // console.log('#getAmountIn:', stableCoinValue, coinAddress);
    return paymentManagerContract.methods.getAmountIn(stableCoinValue, coinAddress).call();
};

// Approve amount of tokens
export const approveToken = (web3, tokenAddress, ownerAddress, spenderAddress, amount, gasPrice) => {
    const token = createErc20Contract(web3, tokenAddress);
    console.log('Approve token', [
        tokenAddress,
        ownerAddress,
        spenderAddress,
        amount
    ]);
    return new Promise((resolve, reject) => {
        token.methods['approve(address,uint256)'](
            spenderAddress,
            amount
        )
        .send({
            from: ownerAddress,
            ...(gasPrice ? { gasPrice } : {})
        })
        .on('confirmation', (number, receipt) => {
            console.log(number, receipt);
            if (receipt.status && number >= 0) {
                resolve(receipt);
            }
        })
        .on('error', error => {
            console.log(error);
            if (error.message.match(/^Transaction has been/g)) {
                reject(new Error('Transaction has been reverted by the EVM'));
            } else {
                reject(error);
            }
        });
    });
};

// Make a payment with ERC20 token
export const payWithToken = (
    web3,
    amountOut,
    amountIn,
    tokenIn,
    deadline,
    attachment,
    from,
    gasPrice
) => new Promise((resolve, reject) => {
    const paymentManager = createPaymentManagerContract(web3);
    console.log('Pay with token', [
        amountOut,
        amountIn,
        tokenIn,
        deadline,
        attachment,
        GLIDER_ORGID
    ]);
    paymentManager.methods.pay(
        amountOut,
        amountIn,
        tokenIn,
        deadline,
        attachment,
        GLIDER_ORGID
    )
    .send({
        from,
        ...(gasPrice ? { gasPrice } : {})
    })
    .on('confirmation', (number, receipt) => {
        console.log(number, receipt);
        if (receipt.status && number >= 2) {
            resolve(receipt);
        }
    })
    .on('error', error => {
        console.log(error);
        if (error.message.match(/^Transaction has been/g)) {
            reject(new Error('Transaction has been reverted by the EVM'));
        } else {
            reject(error);
        }
    });
});

// uint256 amountOut,
// uint256 deadline,
// string calldata attachment,
// bytes32 merchant

// Make a payment with ETH
export const payWithETH = (
    web3,
    amountOut,
    amountIn,
    deadline,
    attachment,
    from,
    gasPrice
) => new Promise((resolve, reject) => {
    const paymentManager = createPaymentManagerContract(web3);
    console.log('Pay with ETH', [
        amountOut,
        deadline,
        attachment,
        GLIDER_ORGID,
        {
            value: amountIn
        }
    ]);
    paymentManager.methods.payETH(
        amountOut,
        deadline,
        attachment,
        GLIDER_ORGID
    )
    .send({
        value: amountIn,
        from,
        ...(gasPrice ? { gasPrice } : {})
    })
    .on('confirmation', (number, receipt) => {
        console.log(number, receipt);
        if (receipt.status && number >= 2) {
            resolve(receipt);
        }
    })
    .on('error', error => {
        console.log(error);
        if (error.message.match(/^Transaction has been/g)) {
            reject(new Error('Transaction has been reverted by the EVM'));
        } else {
            reject(error);
        }
    });
});

// Build ether transfer transaction object
const buildEthTransaction = (from, to, value, gasPrice) => ({
    from,
    to,
    value,
    ...(gasPrice ? { gasPrice } : {})
});

// Send ETH
export const sendEth = (web3, from, to, value, gasPrice) => {
    const tx = buildEthTransaction(from, to, value, gasPrice);
    return new Promise((resolve, reject) => {
        web3.eth.sendTransaction(
            tx,
            (error, hash) => {
                if (error) {
                    return reject(error);
                }
                resolve(hash);
            }
        )
    });
};

// not worked on Infura (((
export const getRevertReason = async (web3, txHash) => {
    const tx = await web3.eth.getTransaction(txHash);
    var result = await web3.eth.call(tx, tx.blockNumber);
    result = result.startsWith('0x') ? result : `0x${result}`;

    if (result && result.substr(138)) {
        const reason = web3.utils.toAscii(result.substr(138))
        console.log('Revert reason:', reason);
        return reason;
    } else {
        console.log('Cannot get reason - No return value')
    }
}

