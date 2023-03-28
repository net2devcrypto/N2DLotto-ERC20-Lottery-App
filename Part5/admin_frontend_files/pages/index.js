
import { Grid, Card, Text, Button, Row, Spacer, Container, Col } from '@nextui-org/react';
import 'sf-font';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { getCurrentLottoId, 
  getDrawJackpot, 
  getDrawTimer,
  getBalance,
  fundContract
 } from '@/components/interfaces';

export default function LotteryAdmin() {
  const [drawId, getLottoId] = useState([])
  const [jackpotBal, getJackpot] = useState([])
  const [ticketSold, getTicketSold] = useState([])
  const [currentBalance, getLottoBalance] = useState([])

  useEffect(() => {
    getLottoStatus()
    functionTimerCountDown()
    fetchBalance()
  }, [])

  useEffect(() => {
    const balanceTimer = setInterval(() =>{
      fetchBalance();
    }, 30000);
    return () => clearInterval(balanceTimer);
    },[])

  async function fetchBalance() {
    let balance = await getBalance();
    let balanceformat = Number(ethers.utils.formatEther(balance.data))
    getLottoBalance(balanceformat)
  }

  async function getFund() {
    const result = await fundContract();
    document.getElementById("result").innerHTML = result;
  }


  async function functionTimerCountDown() {
    const response = await getDrawTimer();
      let timeleft = response.document.time;
      const downloadTimer = setInterval(function () {
        if (timeleft <= 0) {
          clearInterval(downloadTimer);
          console.log("completed");
        } else {
          let hour = Math.floor((timeleft / (1000 * 60 * 60)) % 24);
          document.getElementById("hours").innerHTML = hour;
          let minute = Math.floor((timeleft / 1000 / 60) % 60);
          document.getElementById("minutes").innerHTML = minute;
          let second = Math.floor((timeleft / 1000) % 60);
          document.getElementById("seconds").innerHTML = second;
        }
        timeleft -= 1000;
        if (timeleft < 1000) {
          window.location.reload();
        }
      }, 1000);
    }

  async function getLottoStatus() {
    const lottoid = await getCurrentLottoId();
    getLottoId(lottoid.data);
    const result = await getDrawJackpot();
    let jackpotraw = result.data[4];
    let jackpotint = ethers.utils.formatEther(jackpotraw);
    let jackpot = jackpotint.split('.')[0];
    getJackpot(jackpot);
    const firstTicket = result.data[3];
    const lastTicket = result.data[5];
    let firstTickNum = Number(ethers.utils.formatEther(firstTicket));
    let lastTickNum = Number(ethers.utils.formatEther(lastTicket));
    let totalTickets = (lastTickNum - firstTickNum).toString();
    let ticketformat = totalTickets.split('.')[0]
    getTicketSold(ticketformat);
  }

  return (
      <Container sm css={{background:'black'}}>
        <Row justify="center" align="center">
          <img src="n2dlotto.png" width="320px" height="100px" />
        </Row>
        <Spacer />
        <Row justify="center" align="center">
          <Col justify="center" align="center">
            <Card
              css={{
                justifyContent: "center",
                background: "#ffffff09",
                boxShadow: "0px 1px 4px #ffffff",
              }}
            >
              <Card.Header css={{ justifyContent: "center" }}>
                <Text
                  css={{ color: "white", textShadow: "0px 0px 2px #ffffff" }}
                  h2
                >
                  Admin Portal
                </Text>
              </Card.Header>
              <Text
                  css={{ color: "white", textShadow: "0px 0px 2px #ffffff" }}
                  h4
                >
                  Contract N2DR Balance
                </Text>
                <Text
                  css={{ color: "#39ff14", textShadow: "0px 0px 2px #ffffff" }}
                  h2
                >{currentBalance}
     
                </Text>
                <Card.Body>
                <h4 id='result' style={{color:'white', alignContent:'center'}}></h4>
                <Button onPress={getFund} >Recharge N2DR Contract Balance</Button>
                </Card.Body>
            </Card>
          </Col>
        </Row>
        <Spacer />
        <Grid.Container gap={2} justify="center">
      <Grid xs={4}>
      <Card css={{  $$cardColor: '$colors$gradient' , boxShadow:'0px 0px 3px #ffffff' }}>
        <Card.Body>
        <Text css={{textShadow:'0px 0px 1px #ffffff'}} h5 color="white" >
              Current Draw #
          </Text>
          <Text css={{textShadow:'0px 0px 2px #000000'}} h1 color="white">{drawId}
          </Text>
        </Card.Body>
      </Card>
      </Grid>
      <Grid xs={4}>
      <Card css={{  $$cardColor: '$colors$gradient', boxShadow:'0px 0px 3px #ffffff' }}>
        <Card.Body>
        <Text css={{textShadow:'0px 0px 1px #ffffff'}} h5 color="white" >
              Tickets Sold
          </Text>
          <Text h1 css={{textShadow:'0px 0px 2px #000000'}} color="white">{ticketSold}
          </Text>
        </Card.Body>
      </Card>
      </Grid>
      <Grid xs={4}>
      <Card css={{  $$cardColor: '$colors$gradient', boxShadow:'0px 0px 3px #ffffff' }}>
        <Card.Body>
          <img src="n2dr.png" width="70px" height="30px" />
        <Text css={{textShadow:'0px 0px 1px #ffffff'}} h5 color="white" >
              Accumulated
          </Text>
          <Text h1 css={{textShadow:'0px 0px 2px #000000'}} color="white">{jackpotBal}
          </Text>
        </Card.Body>
      </Card>
      </Grid>
    </Grid.Container>
    <Grid.Container gap={2} justify="center" css={{background:'Black'}}>
      <Grid>
      <Row justify='center'>
        <Text size="20px" css={{textShadow:'0px 0px 1px #ffffff', fontFamily:'SF Pro Display'}} color="white" >Ending In
          </Text>
          </Row>
          <Row>
          <Text css={{ml:'$3', textShadow:'0px 0px 3px #ffffff', fontFamily:'SF Pro Display'}} 
          size="40px" color="#39FF14" id="hours"/>
          <Text color="white" css={{ fontFamily:'SF Pro Display', ml:'$3', fontSize:'18px'}}>Hours</Text>
          <Text css={{ml:'$5', textShadow:'0px 0px 3px #ffffff', fontFamily:'SF Pro Display'}} 
          size="40px" color="#39FF14"id="minutes"/>
          <Text color="white" css={{ fontFamily:'SF Pro Display', ml:'$3', fontSize:'18px'}} >Minutes</Text>
          <Text css={{ml:'$5', textShadow:'0px 0px 3px #ffffff', fontFamily:'SF Pro Display'}} 
          size="40px" color="#39FF14"id="seconds"/>
          <Text color="white" css={{ fontFamily:'SF Pro Display', fontSize:'18px'}}>Seconds</Text>
          </Row>
          </Grid>
      </Grid.Container>
      <Spacer/>
      </Container>
  );
}

