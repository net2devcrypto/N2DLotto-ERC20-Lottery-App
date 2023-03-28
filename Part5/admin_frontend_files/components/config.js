import { ethers } from 'ethers';
import Web3Modal from 'web3modal';


export async function ethConnect() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const erc20 = 'ADD_YOUR_TOKEN_SMART_CONTRACT';
    const lottery = 'ADD_YOUR_LOTTERY_SMART_CONTRACT';
    return {signer, erc20, lottery};
}


