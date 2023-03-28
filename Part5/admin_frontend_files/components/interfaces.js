import axios from "axios";
import { ethConnect } from "./config";
import { ethers } from "ethers";
import tokenABI from "./tokenAbi.json";

const backend = 'http://localhost:8082'

export async function getCurrentLottoId() {
    const url = backend + '/currentlotto';
    const options = {
        headers: {
         "content-type": "application/json"
        }
     };
    const response = await axios.post(url,options);
    return response;
}

export async function getDrawJackpot() {
    const url = backend + '/getdrawjackpot';
    const options = {
       headers: {
        "content-type": "application/json"
       }
    };
    const response = await axios.post(url, options)
    return response;
}

export async function getBalance() {
    const url = backend + '/getbalance';
    const options = {
       headers: {
        "content-type": "application/json"
       }
    };
    const response = await axios.post(url, options)
    return response;
}

export async function getDrawTimer() {
    const url = backend + '/backendtimer';
    const options = {
       method: "POST",
       headers: {
        "content-type": "application/json"
       }
    };
    const response = await fetch(url, options)
    const output = await response.json();
    return output;
}

export async function fundContract() {
    const call = await ethConnect();
    const n2dr = call.erc20;
    const lottery = call.lottery;
    const wallet = call.signer;
    const result = await getDrawJackpot();
    const jackpot = result.data[4];
    const jackpotNum = Number(ethers.utils.formatEther(jackpot))
    let contract = new ethers.Contract(n2dr, tokenABI, wallet);
    let balance = await contract.balanceOf(lottery);
    let balanceNum = Number(ethers.utils.formatEther(balance))
    if (jackpotNum > balanceNum) {
        await contract.transfer(lottery, jackpot);
   }
   else {
        return 'Contract has enough funding';
    }
}



