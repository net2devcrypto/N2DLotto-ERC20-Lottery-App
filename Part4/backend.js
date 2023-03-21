const express = require('express');
const app = express();
const cors=require("cors");
const corsOptions ={
    origin:'*', 
    optionSuccessStatus:200,
 }
app.use(cors(corsOptions))
app.use(require('body-parser').json());

const n2dlogo = `
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▀█ ▄▄█▄ ▄█ ▄ █ ▄▀█ ▄▄█▀███▀
█ ██ █ ▄▄██ ███▀▄█ █ █ ▄▄██ ▀ █
█▄██▄█▄▄▄██▄██ ▀▀█▄▄██▄▄▄███▄██
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`
const n2dLotto = `
█▄ █ ▀█ █▀▄ █   ▄▀▄ ▀█▀ ▀█▀ ▄▀▄
█ ▀█ █▄ █▄▀ █▄▄ ▀▄▀  █   █  ▀▄▀
`
const drawnum = `
█▀▄ █▀▄ ▄▀▄ █   █ █ █▄ █ ▄▀    █▄ █ █ █ █▄ ▄█ ██▄ ██▀ █▀▄ ▄▀▀
█▄▀ █▀▄ █▀█ ▀▄▀▄▀ █ █ ▀█ ▀▄█   █ ▀█ ▀▄█ █ ▀ █ █▄█ █▄▄ █▀▄ ▄██
`
const closing = `
▄▀▀ █   ▄▀▄ ▄▀▀ █ █▄ █ ▄▀    █▀▄ █▀▄ ▄▀▄ █   █
▀▄▄ █▄▄ ▀▄▀ ▄██ █ █ ▀█ ▀▄█   █▄▀ █▀▄ █▀█ ▀▄▀▄▀
`
const winners = `
▄▀  ██▀ ▀█▀ ▀█▀ █ █▄ █ ▄▀    █   █ █ █▄ █ █▄ █ ██▀ █▀▄ ▄▀▀
▀▄█ █▄▄  █   █  █ █ ▀█ ▀▄█   ▀▄▀▄▀ █ █ ▀█ █ ▀█ █▄▄ █▀▄ ▄██
`

const open = `
 ▄▀▄ █▀▄ ██▀ █▄ █   █   ▄▀▄ ▀█▀ ▀█▀ ▄▀▄
 ▀▄▀ █▀  █▄▄ █ ▀█   █▄▄ ▀▄▀  █   █  ▀▄▀
`

const { getDrawTimer, storeTime,
    openLotto,
    closeLotto,
    drawNumbers,
    countWinners} = require('./interfaces');

const runtimer = async () => {
  const response = await getDrawTimer();
  let timeleft = response.document.time;
  setInterval(function () {
    if (timeleft <= 0) {
        console.log('Closing Draw')
        executeLotto()
        let drawreset = 300000;
        storeTime(drawreset);
        timeleft = drawreset;
    } else {
        console.log(timeleft);
        timeleft -= 1000;
        storeTime(timeleft);
    }
  }, 1000);
};


function executeLotto() {
  console.log(closing);
  closeLotto();
  console.log("");
  console.log("");
  setTimeout(function () {
    console.log(drawnum);
    drawNumbers();
    console.log("");
    console.log("");
    setTimeout(function () {
      console.log(winners);
      countWinners();
      console.log("");
      console.log("");
      setTimeout(function () {
        console.log(open);
        openLotto();
        console.log("");
        console.log("");
      }, 60000);
    }, 60000);
  }, 60000);
}




const server = app.listen(8082, function () {
    const port = server.address().port;
    console.log('');
    console.log(n2dlogo)
    console.log('');
    console.log(n2dLotto);
    runtimer();
    console.log("Backend API listening over port: " + port);
  });
