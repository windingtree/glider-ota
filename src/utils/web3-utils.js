import erc20abi from '../config/erc20abi.json';
import web3 from '../redux/sagas/web3';

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

// Create a smart contract object
export const createContract = (web3, abi, address) => new web3.eth.Contract(abi, address);

// Create ERC20 contract object
export const createErc20Contract = (web3, address) => createContract(web3, erc20abi, address);

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
        token.methods['approve(address,uint256)'](ownerAddress, spenderAddress, amount).send(
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
export const parseTokenValue = (web3, value, decimals) => {
    const bnValue = web3.utils.toBN(value);
    const bnDecimals = web3.utils.toBN(decimals);
    const ten = web3.utils.toBN(10);
    return (
        bnValue
        .mul(ten)
        .mul(ten)
        .div(ten.pow(bnDecimals))
        .toNumber() / 100
    ).toFixed(2);
};