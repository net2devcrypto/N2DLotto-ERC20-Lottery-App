# N2DLotto-ERC20-Lottery-App
⚡An ERC20 Crypto Lottery Game App Repo - Build your own lottery game that pays with your own custom ERC20 Token!

<img src="https://github.com/net2devcrypto/misc/blob/main/n2dLotto2.png" width="300" height="60">
<img src="https://github.com/net2devcrypto/misc/blob/main/n2dlotto.gif" width="300" height="300">


** THE FILES ATTACHED TO THIS REPO ARE FOR EDUCATIONAL PURPOSES ONLY **

** NOT FINANCIAL ADVISE **

** USE IT AT YOUR OWN RISK** **I'M NOT RESPONSIBLE FOR ANY USE, ISSUES ETC.. **

ENTIRE PLAYLIST:
<a href="https://www.youtube.com/watch?v=qbG549G8hQo&list=PLLkrq2VBYc1bvQvr-qogw1bxe3wmc61zG" target="_blank"><img src="https://github.com/net2devcrypto/misc/blob/main/ytlogo2.png" width="90" height="20"></a>


<h3>Sections</h3>

<img src="https://github.com/net2devcrypto/misc/blob/main/lottopart1.png" width="250" height="90">

Click for video:

<a href="https://www.youtube.com/watch?v=qbG549G8hQo&t=569s" target="_blank"><img src="https://github.com/net2devcrypto/misc/blob/main/ytlogo2.png" width="150" height="40"></a>

<img src="https://github.com/net2devcrypto/misc/blob/main/lottopart2.png" width="250" height="90">

Click for video:

<a href="https://www.youtube.com/watch?v=zBkYTAIMnN4&t=437s" target="_blank"><img src="https://github.com/net2devcrypto/misc/blob/main/ytlogo2.png" width="150" height="40"></a> 

Please watch tutorial video for full walkthru.

<h4>Inside the Part2 Repo Folder:</h4>

<h5>N2D Lotto Smart Contract Sample with Chainlink VRF Integration</h5>

<h5>NodeJS Array Bubble Sort Function Sample</h5>

<img src="https://github.com/net2devcrypto/misc/blob/main/lottopart3.png" width="250" height="90">

Click for video:

<a href="https://youtu.be/bEQ7wXPBH8E" target="_blank"><img src="https://github.com/net2devcrypto/misc/blob/main/ytlogo2.png" width="150" height="40"></a> 

Please watch tutorial video for full walkthru.

<h4>Inside the Part3 Repo Folder:</h4>

<h5>N2D Lotto Final Smart Contract Completed</h5>

<h5>Sample ERC-20 Smart Contract used during tutorial</h5>

<img src="https://github.com/net2devcrypto/misc/blob/main/lottopart4.png" width="250" height="90">

Click for video:

<a href="https://www.youtube.com/watch?v=Gz-pXG32yWc" target="_blank"><img src="https://github.com/net2devcrypto/misc/blob/main/ytlogo2.png" width="150" height="40"></a> 

Please watch tutorial video for full walkthru.

<h4>Inside the Part4 Repo Folder:</h4>

<h5>NodeJS Backend Demo Files</h5>

<img src="https://github.com/net2devcrypto/misc/blob/main/lottopart5.png" width="250" height="90">

Click for video:

<a href="" target="_blank"><img src="https://github.com/net2devcrypto/misc/blob/main/ytlogo2.png" width="150" height="40"></a> 

Please watch tutorial video for full walkthru.

## Step 1

Create a new NextJS instance:

```shell
npx create-next-app lottoadmin
```

## Step 2

Download the Part5 folder from the repo, open the admin_frontend_files folder, copy and paste the contents inside into your NextJS project folder.
This includes files and folders, Replace files when prompted.

## Step 3

Install Dependencies:

```shell
cd lottoadmin
npm i 
```

## Step 4

Proceed to update your backend by replacing the backend.js and interfaces.js files with the ones located in the Part5 backend_files folder,
but FIRST save your private keys, smart contract addresses located in the interfaces.js before replacing. You should've provided the values when you deployed and setup the backend during Part4 tutorial. Re-insert your values in the variables accordingly.

```shell
const lottery = 'ADD_SMART_CONTRACT_ADDRESS';
const key = 'ADD_CONTRACT_OWNER_WALLET_PRIVATE_KEY';
const apikey = "ADD_MONGODB_API_KEY";
const url = "https://data.mongodb-api.com/app/ADD_MONGODB_API_PATH/endpoint/data/v1/action/";
```

save file! CTRL + S

then start your backend:

```shell
cd backend
node backend.js
```

## Step 5

Proceed to update your config.js file located in the nextjs components folder with your lottery and erc20 smart contract addresses.

save file! CTRL + S

Proceed to update your interfaces.js file located in the nextjs components folder with your backend url address. If you're running the
backend in the same PC as the frontend, do not modify.

save file! CTRL + S

## Step 6

Start application and test!

```shell
cd lottoadmin
npm run dev
```

<img src="https://github.com/net2devcrypto/misc/blob/main/lottopart6.png" width="250" height="90">

Click for video:

<a href="" target="_blank"><img src="https://github.com/net2devcrypto/misc/blob/main/ytlogo2.png" width="150" height="40"></a> 

<h2>Full Lottery Application Setup</h2>

Download the folder "Final" then proceed with steps (This guide assumes you are deploying on Mumbai Testnet but works for other
testnets:

## Step 1  SMART CONTRACT DEPLOYMENT

Create a Chainlink VRF Subscription. Follow video 1 if you have doubts.

Deploy Sample ERC-20 Token Smart Contract to Mumbai Testnet

```shell
N2D-ERC20-Sample-SmartContract.sol
```

Mint ERC-20 Tokens to your wallet and add the token smart contract address to your wallet to confirm you received the tokens.

Deploy the Lottery Smart Contract to Mumbai Testnet, provide the chainlink vrf subscription id and erc-20 token smart contract address to deploy.

```shell
N2DLotto-SmartContract-Final.sol
```

Once deployed, navigate to your Chainlink VRF subscription and add your Lottery Smart Contract address as a consumer.

Follow video 1 if you have doubts.

## Step 2 Backend DEPLOYMENT

Navigate to the backend folder located on the "Final" folder then install dependencies:

```shell
cd final
cd backend
npm i 
```

Update the interfaces.js file with your contract addresses and keys: 

```shell
const lottery = 'ADD-LOTTERY-SMART-CONTRACT';
const key = 'ADD-SMART-CONTRACT-OWNER-WALLET-PRIVATE-KEY';
const apikey = "ADD-MONGO-DB-API-KEY";
const url = "https://data.mongodb-api.com/app/ADD-MONGO-DB-API-PATH/endpoint/data/v1/action/"; // replace "ADD-MONGO-DB-API-PATH" with your api path.
```
CTRL + S to save file

Run your backend:

```shell
cd final
cd backend
node backend.js
```

Follow video 4 if you have doubts.

## Step 3 Admin Front-End DEPLOYMENT

Create a new nextjs instance for your admin front end: 

```shell
npx create-next-app lottoadmin
```

If prompted: 

- No typescript
- yes ESLINT
- No Src
- No App
- Yes alias


Copy all the files inside "admin-front-end" folder located on the "Final" folder and paste inside the nextjs "lottoadmin"
project folder. Replace files when promted.

Navigate to the nextjs "lottoadmin" project front-end folder and install dependencies.

```shell
cd lottoadmin
npm i 
```

Update the config.js file located in the "components" folder with your contract addresses: 

```shell
const erc20 = 'ADD-ERC-20-SMART-CONTRACT-ADDRESS';
const lottery = 'ADD-LOTTERY-SMART-CONTRACT-ADDRESS';
```

CTRL + S to save file

Update the interfaces.js file located in the "components" folder with your backend addresses: 

```shell
const backend = 'http://ADD-BACKEND-IP-ADDRESS:8082'
```

CTRL + S to save file

Run the Lotto Admin Front-end:

```shell
cd lottoadmin
npm run dev
```

Confirm you can access the front-end!

Follow video 5 if you have doubts.

## Step 4 Lotto Front-End DEPLOYMENT

Create a new nextjs instance for your game front end: 

```shell
npx create-next-app lottogame
```

If prompted: 

- No typescript
- yes ESLINT
- No Src
- No App
- Yes alias

Copy all the files inside "game-front-end" folder located on the "Final" folder and paste inside the nextjs "lottogame"
project folder. Replace files when promted.

Navigate to the nextjs "lottogame" project front-end folder and install dependencies.

```shell
cd lottogame
npm i 
```

Update the config.js file located in the "components" folder with your contract addresses: 

```shell
export const lotterycontract = 'ADD-LOTTO-SMART-CONTRACT';
export const erc20contract = "ADD-ERC20-SMART-CONTRACT";
```

CTRL + S to save file

Update the interfaces.js file located in the "components" folder with your backend addresses: 

```shell
const backend = 'http://ADD-BACKEND-IP-ADDRESS:8082'
```

CTRL + S to save file

Run the Lotto Game Front-end:

```shell
cd lottogame
npm run dev
```

Confirm you can access the front-end!

Follow Final Video if you have doubts.






