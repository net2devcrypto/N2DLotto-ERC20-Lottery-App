import { ethers } from 'ethers';
import Web3Modal from 'web3modal';


export async function ethConnect() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const erc20 = 'ADD-ERC-20-SMART-CONTRACT-ADDRESS';
    const lottery = 'ADD-LOTTERY-SMART-CONTRACT-ADDRESS'
    return {signer, erc20, lottery};
}


