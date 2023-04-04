import { ethers } from 'ethers';
import axios from 'axios';

const backend = 'http://ADD-BACKEND-IP-ADDRESS:8082';

export async function getDrawTimer() {
    const url = backend + '/backendtimer';
    const config = {
        method: "POST",
        headers: {
        "content-type": "application/json"
        }
    }
    const response = await fetch(url, config);
    const output = await response.json()
    return output;
}

export async function sortArray(tckNum) {
    for (let i = 1; i < tckNum.length; i++) {
           let swapped = false;
           for (let j = 0; j < tckNum.length - i; j++) {
               let next = tckNum[j + 1];
               let actual = tckNum[j];
               if (next < actual) {
                  tckNum[j] = next;
                  tckNum[j + 1] = actual;
                  swapped = true;
               }
           }
           if (!swapped) {
               return tckNum;
           }
       }
       return tckNum;
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

export async function getlotteryInfo(lottoId) {
  const url = backend + '/viewlotto';
  const options = {
    method: 'POST',
    body: JSON.stringify({
      lottoId
    }),
     headers: {
      "content-type": "application/json"
     }
  };
  let response = await fetch(url, options)
  let output = await response.json();
  return output;
}

export async function getTicketInfo(ticketId) {
  const url = backend + '/viewtickets';
  const options = {
    method: 'POST',
    body: JSON.stringify({
      ticketId
    }),
     headers: {
      "content-type": "application/json"
     }
  };
  let response = await fetch(url, options)
  let output = await response.json();
  return output;
}

export async function getCurrentLottoId() {
    const url = backend + '/currentlotto';
    const options = {
       headers: {
        "content-type": "application/json"
       }
    };
    const response = await axios.post(url, options)
    return response;
}


export async function getLottoJackpot() {
    const result = await getDrawJackpot();
    const jackpotraw = result.data[4];
    let total = [];
    let jackpotRaw = ethers.utils.formatEther(jackpotraw)
    let jackpot = jackpotRaw.split('.')[0]
    total.push(jackpot);
    return total;
  }


export async function formatOutput(data) {
  const rawnumber = ethers.utils.formatEther(data)
  const formatnumber = (rawnumber).split('0').pop()
  return formatnumber;
}


/**
 * Get current lotto number
 * 
 * for each lotto Id, get firstticketid and lastticketid then
 * viewTickets 
 * 
 * 
 */

export async function getWinningNumbers(lottoId) {
  const winner1 = [];
  const winner2 = [];
  const winner3 = [];
  const winner4 = [];
  const winner5 = [];
  const winner6 = [];
  const result = await getlotteryInfo(lottoId);
  const rawnumber1 = result[6][0]
  const number1 = await formatOutput(rawnumber1);
  winner1.push(number1);
  const rawnumber2 = result[6][1]
  const number2 = await formatOutput(rawnumber2);
  winner2.push(number2);
  const rawnumber3 = result[6][2]
  const number3 = await formatOutput(rawnumber3);
  winner3.push(number3);
  const rawnumber4 = result[6][3]
  const number4 = await formatOutput(rawnumber4);
  winner4.push(number4);
  const rawnumber5 = result[6][4]
  const number5 = await formatOutput(rawnumber5);
  winner5.push(number5);
  const rawnumber6 = result[6][5]
  const number6 = await formatOutput(rawnumber6);
  winner6.push(number6);
  return {winner1, winner2, winner3, winner4, winner5, winner6}
}

export async function getWinnerNumbers(lottoid) {
  const result = await getWinningNumbers(lottoid);
  const winningNum = [
    result.winner1, 
    result.winner2, 
    result.winner3, 
    result.winner4, 
    result.winner5,
    result.winner6
  ]
  return {winningNum, lottoid};
}