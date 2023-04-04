import { useState, useEffect} from 'react';
import { Grid, Card, Text, Col, Container, 
  Spacer, Button, Row, 
  Modal, useModal} from "@nextui-org/react";
import confetti from 'canvas-confetti';
import { getDrawTimer, 
  getLottoJackpot, 
  getWinningNumbers, 
  getCurrentLottoId, 
  getWinnerNumbers, sortArray} from '../components/interfaces';
import { buyTicket, claimPrize } from '../components/web3functions';

let digitCount = 0;

export default function Lottery() {
  const { setVisible, bindings } = useModal();
  const [drawNum, viewDrawNum] = useState([]);
  const [win1, showNumber1] = useState([]);
  const [win2, showNumber2] = useState([]);
  const [win3, showNumber3] = useState([]);
  const [win4, showNumber4] = useState([]);
  const [win5, showNumber5] = useState([]);
  const [win6, showNumber6] = useState([]);
  const [tckNum, getTckNumb] = useState([]);
  const [totalpot, getJackpot] = useState([]);
  const [lotto, getLotto] = useState([]);

  const handleConfetti = () => {
    confetti();
    setVisible(true);
  };

  useEffect(() => {
    functionTimerCountDown();
    getLottoData();
    getDrawNumbers();
    getAllWinningNumbers();
  },[] )

  async function functionTimerCountDown() {
    const response = await getDrawTimer()
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
      }, 1000);
    }

const addDigits = (e) => {
  if (digitCount < 6) {
    getTckNumb([...tckNum, e]);
    let parent = document.getElementById("numoutput");
    let div1 = document.createElement("div");
    div1.className = "digit";
    let html = `
        <span>${e.trim()}</span>
    `;
    div1.innerHTML = html;
    parent.appendChild(div1);
    digitCount++;
  } else {
    return;
  }
};

const removeDigits = () => {
  if (digitCount > 0) {
    tckNum.pop();
    getTckNumb(tckNum);
    let parent = document.getElementById("numoutput");
    parent.removeChild(parent.lastElementChild);
    digitCount--;
  }
};

  const buyTickets = async () => {
    if (digitCount == 6) {
      let numberArray = [];
      let stringArray = [];
      for (let i = 0; i < tckNum.length; i++) {
        numberArray.push(parseInt(tckNum[i]));
      }
      const numbers = await sortArray(numberArray);
      for (let i = 0; i < numbers.length; i++) {
        stringArray.push((numbers[i]).toString());
      }
      const tx = await buyTicket(stringArray);
      if (tx) {
      document.getElementById("complete").innerHTML = "Tx Successful, Refreshing...";
      setTimeout(() => {
        window.location.reload();
      }, 4000)
      }
    }
    else {
      console.log('transaction canceled');
    }
  }

  const getAllWinningNumbers = async () => {
    const currentId = await getCurrentLottoId()
    const lastDrawId = (currentId.data - 1).toString();
    const firstDrawId = lastDrawId - 6;
    const dataArray = [];
    for (let i = 1; i < 6; i++) {
    let idValue = firstDrawId + i;
    const data = await getWinnerNumbers(idValue);
    dataArray.push(data);
    }
    const reverseArray = dataArray.reverse();
    viewDrawNum(reverseArray);
  }

  const getLottoData = async () => {
    const lottoid = await getCurrentLottoId();
    getLotto(lottoid.data)
    const result = await getLottoJackpot()
    getJackpot(result);
  }

  const claim = async (lottoId) => {
    if (lottoId == undefined) {
      const claimresult = await claimPrize(lotto - 1);
      if (claimresult == 'Not lucky'){
        alert('Sorry, No Winning Tickets Found on your Wallet');
      }
      else {
        alert('Congrats!! Your prize amount has been sent!');
      }
    }
    else {
    const claimresult = await claimPrize(lottoId);
    if (claimresult == 'Not lucky'){
      alert('Sorry, No Winning Tickets Found on your Wallet');
    }
    else {
      alert('Congrats!! Your prize amount has been sent!');
    }
  }
  }

  async function getDrawNumbers() {
    const currentId = await getCurrentLottoId()
    const lottoid = (currentId.data - 1).toString();
    const output = await getWinningNumbers(lottoid);
    showNumber1(output.winner1);
    showNumber2(output.winner2);
    showNumber3(output.winner3);
    showNumber4(output.winner4);
    showNumber5(output.winner5);
    showNumber6(output.winner6);
  }


  return (
    <div className="appback">
      <Container sm gap={3}>
        <Row gap={0} justify="left" align="left">
          <Col>
            <Row>
              <img src="star-small.png" alt="" width="70px" height="62px" />
            </Row>
            <Row>
              <img src="star-big.png" alt="" width="124px" height="109px" />
            </Row>
            <Spacer />
            <Row>
              <img src="cartoon1.png" alt="" width="223px" height="300px" />
            </Row>
          </Col>
          <Col>
            <Row justify="center" align="center">
              <img src="n2dlotto.png" width="320px" height="100px" />
            </Row>
            <Spacer />
            <Row justify="center" align="center">
              <Text
                css={{ textShadow: "1px 0px 2px #000000" }}
                color="white"
                h2
              >
                Draw #{lotto} Live!!
              </Text>
            </Row>
            <Row justify="center" align="center">
              <Text
                css={{ textShadow: "1px 0px 2px #000000" }}
                color="white"
                h2
              >
                Current Jackpot
              </Text>
            </Row>
            <Row justify="center" align="center">
              <Text
                h1
                color="black"
                size="60px"
                css={{ textShadow: "1px 0px 6px #39ff14" }}
              >{totalpot}
              </Text>
              <img
                  src="n2dr.png"
                  style={{ marginLeft: "3px" }}
                  width="120px"
                  height="45px"
                />
            </Row>
            <Grid.Container gap={2} justify="center">
      <Grid>
      <Row justify='center'>
        <Text size="25px" css={{textShadow:'0px 0px 1px #ffffff', 
        fontFamily:'SF Pro Display'}} color="white" >Ending In
          </Text>
          </Row>
          <Row>
          <Text css={{ml:'$3', textShadow:'0px 0px 3px #ffffff', fontFamily:'SF Pro Display', fontWeight:'$bold'}} 
          size="45px" color="#ffff00" id="hours"/>
          <Text color="white" css={{ fontFamily:'SF Pro Display', ml:'$3', fontSize:'18px'}}>Hours</Text>
          <Text css={{ml:'$5', textShadow:'0px 0px 3px #ffffff', fontFamily:'SF Pro Display', fontWeight:'$bold'}} 
          size="45px" color="#ffff00"id="minutes"/>
          <Text color="white" css={{ fontFamily:'SF Pro Display', ml:'$3', fontSize:'18px'}} >Minutes</Text>
          <Text css={{ml:'$5', textShadow:'0px 0px 3px #ffffff', fontFamily:'SF Pro Display', fontWeight:'$bold'}} 
          size="45px" color="#ffff00"id="seconds"/>
          <Text color="white" css={{ fontFamily:'SF Pro Display', fontSize:'18px'}}>Seconds</Text>
          </Row>
          </Grid>
      </Grid.Container>
            <Spacer />
            <Spacer />
            <Row justify="center" align="center">
              <Button
                auto
                rounded
                ripple={false}
                size="xl"
                onPress={handleConfetti}
                css={{
                  background: "$green800",
                  fontWeight: "$extrabold",
                  boxShadow: "$lg",
                  position: "relative",
                  overflow: "visible",
                  color: "white",
                  textShadow: "0px 0px 2px #ffffff",
                  fontSize: "$xl",
                  px: "$18",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background: "$accents9",
                    opacity: 1,
                    borderRadius: "$pill",
                    transition: "all 0.4s ease",
                  },
                  "&:hover": {
                    transform: "translateY(-5px)",
                    "&:after": {
                      transform: "scaleX(1.5) scaleY(1.6)",
                      opacity: 0,
                    },
                  },
                  "&:active": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Play Now
              </Button>
              <div>
                <Modal
                  scroll
                  width="600px"
                  aria-labelledby="modal-title"
                  aria-describedby="modal-description"
                  {...bindings}
                >
                  <Modal.Header>
                    <Text id="modal-title" style={{fontFamily:'SF Pro Display'}} h3>
                      Select 6 Lucky Numbers!
                    </Text>
                  </Modal.Header>
                  <Modal.Body>
                    <Text css={{display:'flex', gap:'$10', 
                    justifyContent:'center', 
                    fontFamily:'SF Pro Display'}} id="numoutput" size={50}>
                  </Text>
                  <Grid.Container gap={2}>
                    <Grid>
                      <Button value="1" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}} 
                      onPress={(e) => addDigits(e.target.value)} auto>
                       1
                      </Button>
                    </Grid>
                  <Grid>
                      <Button value="2" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       2
                      </Button>
                    </Grid>
                    <Grid>
                      <Button value="3" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}} 
                      onPress={(e) => addDigits(e.target.value)} auto>
                       3
                      </Button>
                    </Grid>
                  <Grid>
                      <Button value="4"  shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       4
                      </Button>
                    </Grid>
                    <Grid>
                      <Button value="5" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       5
                      </Button>
                    </Grid>
                  <Grid>
                      <Button value="6" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       6
                      </Button>
                    </Grid>
                    <Grid>
                      <Button value="7" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       7
                      </Button>
                    </Grid>
                  <Grid>
                      <Button value="8" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       8
                      </Button>
                    </Grid>
                    <Grid>
                      <Button value="9" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       9
                      </Button>
                    </Grid>
                  <Grid>
                      <Button value="10" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       10
                      </Button>
                    </Grid>
                    <Grid>
                      <Button value="11" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       11
                      </Button>
                    </Grid>
                  <Grid>
                      <Button value="12" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       12
                      </Button>
                    </Grid>
                    <Grid>
                      <Button value="13" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       13
                      </Button>
                    </Grid>
                  <Grid>
                      <Button value="14" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       14
                      </Button>
                    </Grid>
                    <Grid>
                      <Button value="15" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       15
                      </Button>
                    </Grid>
                  <Grid>
                      <Button value="16" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       16
                      </Button>
                    </Grid>
                    <Grid>
                      <Button value="17" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       17
                      </Button>
                    </Grid>
                  <Grid>
                      <Button value="18" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       18
                      </Button>
                    </Grid>
                    <Grid>
                      <Button value="19" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       19
                      </Button>
                    </Grid>
                  <Grid>
                      <Button value="20" shadow bordered color="gradient" style={{fontSize:'22px', fontFamily:'SF Pro Display'}}
                      onPress={(e) => addDigits(e.target.value)} auto>
                       20
                      </Button>
                    </Grid>

                  </Grid.Container>
                  <Text css={{display:'flex', gap:'$10', 
                    justifyContent:'center', 
                    fontFamily:'SF Pro Display'}} id="complete" size={30}>
                  </Text>
                  </Modal.Body>
                  <Modal.Footer>
                    <Text h4 css={{fontFamily:"SF Pro Display"}}>cost 10<img
                  src="n2dr.png"
                  style={{ marginLeft: "3px" }}
                  width="60px"
                  height="25px"
                /></Text>
                  <Button
                auto
                flat
                ripple={false}
                onPress={buyTickets}
                size="md"
                css={{
                  background: "$green800",
                  fontWeight: "$extrabold",
                  boxShadow: "$lg",
                  position: "relative",
                  overflow: "visible",
                  borderRadius:'$lg',
                  color: "white",
                  fontSize: "$xl",
                  px: "$18",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background: "$accents9",
                    opacity: 1,
                    transition: "all 0.4s ease",
                  },
                  "&:hover": {
                    transform: "translateY(-5px)",
                    "&:after": {
                      transform: "scaleX(1.5) scaleY(1.6)",
                      opacity: 0,
                    },
                  },
                  "&:active": {
                    transform: "translateY(-2px)",
                  },
                }}
              >
               Buy
              </Button>
                    <Button
                      auto
                      flat
                      color="secondary"
                      onPress={removeDigits}
                      style={{background:'black', color:'white', fontFamily:'SF Pro Display'}}
                    >
                     Remove #
                    </Button>
                    <Button
                      auto
                      flat
                      color="secondary"
                      onPress={() => setVisible(false)}
                    >
                     Return
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </Row>
            <Spacer />
            <Row justify="center" align="center"></Row>
          </Col>
          <Row>
            <Col>
              <Row justify="right" align="right">
                <img
                  src="three-stars.png"
                  alt=""
                  width="130px"
                  height="144px"
                />
              </Row>
              <Spacer />
              <Row justify="right" align="right">
                <img src="cartoon2.png" alt="" width="260px" height="270px" />
              </Row>
            </Col>
          </Row>
        </Row>
        <Card
          css={{
            background: "#00000030",
            mt: "$5",
            mb: "$3",
          }}
        >
          <Row gap={0} justify="center" align="center">
            <Text color="white" css={{ textShadow: "0px 0px 3px #000000" }} h2>
              Draw #{lotto - 1} Results
            </Text>
          </Row>
          <Row gap={0} css={{ margin: "$5" }} justify="center" align="center">
            <div className="wrap">
              <Row>
                <section className="stage">
                  <figure className="ball">
                    <span className="number">
                      {win1}
                    </span>
                  </figure>
                </section>
                <section className="stage">
                  <figure className="ball">
                    <span className="number" >
                      {win2}
                    </span>
                  </figure>
                </section>
                <section className="stage">
                  <figure className="ball">
                    <span className="number">
                     {win3}
                    </span>
                  </figure>
                </section>
                <section className="stage">
                  <figure className="ball">
                    <span className="number" >
                     {win4}
                    </span>
                  </figure>
                </section>
                <section className="stage">
                  <figure className="ball">
                    <span className="number">
                     {win5}
                    </span>
                  </figure>
                </section>
                <section className="stage">
                  <figure className="ball">
                    <span className="number">
                     {win6}
                    </span>
                  </figure>
                </section>
              </Row>
            </div>
          </Row>
      <Spacer/>
      <Row>
            <Button auto size='md' ghost
                    onPress={claim}
                    css={{display:'flex',
                    justifyContent:'center', 
                    color:'white',
                    fontSize:'$2xl'
                    }}>Claim</Button>
                    </Row>
      </Card>
      <Text h2 css={{display:'flex', justifyContent:'center'}}>
          Previous Draw Results
      </Text>
          {drawNum.map((draw, i) => {
            return (
              <Card
                key={i}
                css={{
                  p: "$1",
                  mt: "$3",
                  ml: "$4",
                  mb: "$4",
                  background: "#000000",
                }}
              >
                  <Card.Header css={{display:'flex', justifyContent:'center'}}>
                  <img
                    alt="nextui logo"
                    src="n2dlotto2.png"
                    width="110px"
                    height="30px"
                  />
                  <Text h3 css={{color:'white', 
                  marginTop:'$4', 
                  marginLeft:'$2'}}>Draw # {draw.lottoid}</Text>
                  </Card.Header>
                  <Grid.Container css={{pt:'$0'}} >
                    <Row>
                    <Grid xs={22}>
                    <section className="stage">
                  <figure className="ball">
                    <span className="number">
                    {draw.winningNum[0]}
                    </span>
                  </figure>
                </section>
                    </Grid>
                    <Grid xs={22}>
                    <section className="stage">
                  <figure className="ball">
                    <span className="number">
                    {draw.winningNum[1]}
                    </span>
                  </figure>
                </section>
                    </Grid>
                    <Grid xs={22}>
                    <section className="stage">
                  <figure className="ball">
                    <span className="number">
                    {draw.winningNum[2]}
                    </span>
                  </figure>
                </section>
                    </Grid>
                    <Grid xs={22}>
                    <section className="stage">
                  <figure className="ball">
                    <span className="number">
                    {draw.winningNum[3]}
                    </span>
                  </figure>
                </section>
                    </Grid>
                    <Grid xs={22}>
                    <section className="stage">
                  <figure className="ball">
                    <span className="number">
                    {draw.winningNum[4]}
                    </span>
                  </figure>
                </section>
                    </Grid>
                    <Grid xs={22}>
                    <section className="stage">
                  <figure className="ball">
                    <span className="number">
                    {draw.winningNum[5]}
                    </span>
                  </figure>
                </section>
                    </Grid>
                    </Row>
                    <Row>
                    <Button value={draw.lottoid} auto ghost
                    onPress={(e) => claim(e.target.value)}
                    css={{display:'flex',
                    justifyContent:'center', 
                    color:'white',
                    fontSize:'$2xl'
                    }}>Claim</Button>
                    </Row>
                  </Grid.Container>
              </Card>
            );
          })}
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
        <Spacer />
      </Container>
    </div>
  );
}
