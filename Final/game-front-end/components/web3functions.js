import Web3Modal from 'web3modal';
import { ethers } from "ethers";
import LOTTOABI from './lottoabi.json';
import TOKENABI from './erc20abi.json';
import { lotterycontract, erc20contract } from './config';
import { formatOutput, getCurrentLottoId, getlotteryInfo } from './interfaces';


export async function ethConnect() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const lottoctr = new ethers.Contract(lotterycontract, LOTTOABI, signer);
    const tokenctr = new ethers.Contract(erc20contract, TOKENABI, signer);
    return {lottoctr, tokenctr};
}


export async function buyTicket(ticketArray) {
  const output = await ethConnect();
  const lottoContract = output.lottoctr;
  const erc20Contract = output.tokenctr;
  const price = await lottoContract.ticketPrice();
  const tx1 = await erc20Contract.approve(lotterycontract, price);
  const receipt1 = await tx1.wait();
  if (receipt1) {
    const tx2 = await lottoContract.buyTickets(ticketArray);
    const receipt2 = await tx2.wait();
    if (receipt2) {
        const currentId = await getCurrentLottoId();
        const result = await getlotteryInfo(currentId.data);
        const hexLastTicket = result[5];
        const LastTicketStr = await formatOutput(hexLastTicket);
      return "Tx Completed, Ticket Number: " + LastTicketStr;
    } else {
      return "Tx Canceled";
    }
  } else {
    return "Tx Canceled";
  }
}

export async function claimPrize(lottoId) {
  const output = await ethConnect();
  const lottoContract = output.lottoctr;
  const tx = await lottoContract.claimPrize(lottoId).catch(error => { return 'Not Payable'})
  if (tx != 'Not Payable') {
    return 'Paid'
  }
  else {
  return 'Not lucky'
  }
}


