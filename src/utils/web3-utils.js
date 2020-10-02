import erc20abi from '../config/erc20abi.json';
import IUniswapV2Router02 from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import { UNISWAP_ROUTER_ADDRESS } from '../config/default';

// Converts network Id to the name format
export const networkIdParser = id => {
    id = parseInt(id);
    switch (id) {
        case 1:
            return 'main';
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
        case 'main':
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

// Create a smart contract object
export const createContract = (web3, abi, address) => new web3.eth.Contract(abi, address);

// Create ERC20 contract object
export const createErc20Contract = (web3, address) => createContract(web3, erc20abi, address);

// Create Uniswap Router contract
export const createUniswapRouterContract = web3 => createContract(web3, IUniswapV2Router02.abi, UNISWAP_ROUTER_ADDRESS);

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

// Approve amount of tokens
export const approveToken = (web3, tokenAddress, ownerAddress, spenderAddress, amount, gasPrice) => {
    const token = createErc20Contract(web3, tokenAddress);
    return new Promise((resolve, reject) => {
        token.methods['approve(address,uint256)'](spenderAddress, amount).send(
            {
                from: ownerAddress,
                ...(gasPrice ? { gasPrice } : {})
            },
            (error, hash) => {
                if (error) {
                    return reject(error);
                }
                resolve(hash);
            }
        );
    });
};

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
        value,
        mappedUnits(web3)[Math.pow(10, decimals)]
    );
