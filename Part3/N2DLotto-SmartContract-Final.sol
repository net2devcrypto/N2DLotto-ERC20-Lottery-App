// SPDX-License-Identifier: MIT LICENSE

/*
Follow/Subscribe Youtube, Github, IM, Tiktok
for more amazing content!!
@Net2Dev
                     __      ______        __                    
                    |  \    /      \      |  \                   
 _______   ______  _| ▓▓_  |  ▓▓▓▓▓▓\ ____| ▓▓ ______  __     __ 
|       \ /      \|   ▓▓ \  \▓▓__| ▓▓/      ▓▓/      \|  \   /  \
| ▓▓▓▓▓▓▓\  ▓▓▓▓▓▓\\▓▓▓▓▓▓  /      ▓▓  ▓▓▓▓▓▓▓  ▓▓▓▓▓▓\\▓▓\ /  ▓▓
| ▓▓  | ▓▓ ▓▓    ▓▓ | ▓▓ __|  ▓▓▓▓▓▓| ▓▓  | ▓▓ ▓▓    ▓▓ \▓▓\  ▓▓ 
| ▓▓  | ▓▓ ▓▓▓▓▓▓▓▓ | ▓▓|  \ ▓▓_____| ▓▓__| ▓▓ ▓▓▓▓▓▓▓▓  \▓▓ ▓▓  
| ▓▓  | ▓▓\▓▓     \  \▓▓  ▓▓ ▓▓     \\▓▓    ▓▓\▓▓     \   \▓▓▓   
 \▓▓   \▓▓ \▓▓▓▓▓▓▓   \▓▓▓▓ \▓▓▓▓▓▓▓▓ \▓▓▓▓▓▓▓ \▓▓▓▓▓▓▓    \▓    

THIS CONTRACT IS AVAILABLE FOR EDUCATIONAL
PURPOSES ONLY. YOU ARE SOLELY REPONSIBLE
FOR ITS USE. I AM NOT RESPONSIBLE FOR ANY
OTHER USE. THIS IS TRAINING/EDUCATIONAL
MATERIAL. ONLY USE IT IF YOU AGREE TO THE
TERMS SPECIFIED ABOVE.


 █▄ █ ▀█ █▀▄ █   ▄▀▄ ▀█▀ ▀█▀ ▄▀▄
 █ ▀█ █▄ █▄▀ █▄▄ ▀▄▀  █   █  ▀▄▀  v1

A fun lottery smart contract which users can buy lotto tickets and participate
in an ERC20 Jackpot draw.

*/

pragma solidity ^0.8.7.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "n2drewards.sol";


contract N2DLottery is ReentrancyGuard, Ownable, VRFConsumerBaseV2 {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    /**
    ChainLink VRFv2 Subscription Settings
     - We will obtain the winning numbers by querying the Chainlink randomness generator.
     - vrfCoordinator and s_keyHash values are for specific testnet/mainnet,
     - Check ChainLink Docs and change values for your network accordingly: 
       https://docs.chain.link/vrf/v2/subscription/supported-networks
    */

    VRFCoordinatorV2Interface COORDINATOR;

    uint64 private s_subscriptionId;
    address private vrfCoordinator = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
    bytes32 private keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint16 private requestConfirmations = 3;
    uint32 private numWords =  6;
    uint32 private callbackGasLimit = 2500000;
    address private s_owner;


    struct RequestStatus {
        bool fulfilled;
        bool exists;
        uint[] randomWords;
    }

    mapping(uint256 => RequestStatus) public s_requests;
    uint256 public lastRequestId;

    /**
    Lottery Settings
    */

    IERC20 paytoken;
    uint256 public currentLotteryId;
    uint256 public currentTicketId;
    uint256 public ticketPrice = 10 ether;
    uint256 public serviceFee = 3000; // BASIS POINTS 3000 is 30%
    uint256 public numberWinner;


    enum Status {
        Open,
        Close,
        Claimable
    }

    struct Lottery {
        Status status;
        uint256 startTime;
        uint256 endTime;
        uint256 firstTicketId;
        uint256 transferJackpot;
        uint256 lastTicketId;
        uint[6] winningNumbers;
        uint256 totalPayout;
        uint256 commision;
        uint256 winnerCount;
    }

    struct Ticket {
        uint256 ticketId;
        address owner;
        uint[6] chooseNumbers;
    }

    mapping(uint256 => Lottery) private _lotteries;
    mapping(uint256 => Ticket) private _tickets;
    mapping(address => mapping(uint256 => uint256[])) private _userTicketIdsPerLotteryId;
    mapping(address => mapping(uint256 => uint256)) public _winnersPerLotteryId;

    event LotteryWinnerNumber(uint256 indexed lotteryId, uint[6] finalNumber);

    event LotteryClose(
        uint256 indexed lotteryId,
        uint256 lastTicketId
    );

    event LotteryOpen(
        uint256 indexed lotteryId,
        uint256 startTime,
        uint256 endTime,
        uint256 ticketPrice,
        uint256 firstTicketId,
        uint256 transferJackpot,
        uint256 lastTicketId,
        uint256 totalPayout
    );

    event TicketsPurchase(
        address indexed buyer,
        uint256 indexed lotteryId,
        uint[6] chooseNumbers
    );

    constructor(uint64 subscriptionId, IERC20 _paytoken) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
        paytoken = _paytoken;
    }

/**
##############################################################################################
 */

    function openLottery() external onlyOwner nonReentrant {
        currentLotteryId++;
        currentTicketId++;
        uint256 fundJackpot = (_lotteries[currentLotteryId].transferJackpot).add(1000 ether);
        uint256 transferJackpot;
        uint256 totalPayout;
        uint256 lastTicketId;
        uint256 endTime;
        _lotteries[currentLotteryId] = Lottery({
            status: Status.Open,
            startTime: block.timestamp,
            endTime: (block.timestamp).add(1 days),
            firstTicketId: currentTicketId,
            transferJackpot: fundJackpot,
            winningNumbers: [uint(0), uint(0), uint(0), uint(0), uint(0), uint(0)],
            lastTicketId: currentTicketId,
            totalPayout: 0,
            commision: 0,
            winnerCount: 0
        });
        emit LotteryOpen(
            currentLotteryId,
            block.timestamp,
            endTime,
            ticketPrice,
            currentTicketId,
            transferJackpot,
            lastTicketId,
            totalPayout
        );
    }

/**
##############################################################################################
 */

    function buyTickets(uint[6] calldata numbers) public payable nonReentrant {
        uint256 walletBalance = paytoken.balanceOf(msg.sender);
        require(walletBalance >= ticketPrice, "Funds not available to complete transaction");
        paytoken.transferFrom(address(msg.sender), address(this), ticketPrice);
    /**
    Calculate Commision Fee
    */
        uint256 commisionFee = (ticketPrice.mul(serviceFee)).div(10000);
    /**
     * Lets obtain the platform commision per ticket sale.
     * Lets assume:  Ticket Price is 10 ether,
     * Service Fee is 30% (or 3000) Find the variable at the beginning.
     *
     *  Formula is :
     *      ticket Price x serviceFee / 10000
     *
     *      10 x 3000 / 10000 = 3
     *
     *      3 is the token amount earned in the platform from each ticket sale.
     *
     */
        _lotteries[currentLotteryId].commision += commisionFee;
        uint256 netEarn = ticketPrice - commisionFee;
        _lotteries[currentLotteryId].transferJackpot += netEarn;

        /**
        Lets store each ticket number array referenced to the buyer's wallet.
        mapping(address => mapping(uint256 => uint256[])) private _userTicketIdsPerLotteryId;
        */
        _userTicketIdsPerLotteryId[msg.sender][currentLotteryId].push(currentTicketId);
        //

        _tickets[currentTicketId] = Ticket({ticketId:currentTicketId, owner: msg.sender, chooseNumbers: numbers });
        currentTicketId++;
        _lotteries[currentLotteryId].lastTicketId = currentTicketId;
        emit TicketsPurchase(msg.sender, currentLotteryId, numbers);
    }

/**
##############################################################################################
 */

    function closeLottery() external onlyOwner {
        require(_lotteries[currentLotteryId].status == Status.Open, "Lottery not open");
        require(block.timestamp > _lotteries[currentLotteryId].endTime, "Lottery not over");
        _lotteries[currentLotteryId].lastTicketId = currentTicketId;
        _lotteries[currentLotteryId].status = Status.Close;

        /**
        Request Id Stores the ChainLink VRF request Id, this is fetched once we execute the drawNumbers()
        and from there we will obtain a random number that we can use to obtain the winning numbers.
        */

        uint256 requestId;
  
        /**
        Lets finally call ChainLink VRFv2 and obtain the winning numbers from the randomness generator.
         */

        requestId = COORDINATOR.requestRandomWords(
        keyHash,
        s_subscriptionId,
        requestConfirmations,
        callbackGasLimit,
        numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        lastRequestId = requestId;
        emit LotteryClose(currentLotteryId, currentTicketId);
    }

/**
##############################################################################################
 */

   function drawNumbers() external onlyOwner nonReentrant () {
        require(_lotteries[currentLotteryId].status == Status.Close, "Lottery not close");
        uint256[] memory numArray = s_requests[lastRequestId].randomWords;
          uint num1 = numArray[0] % 10;
          uint num2 = numArray[1] % 10;
          uint num3 = numArray[2] % 10;
          uint num4 = numArray[3] % 10;
          uint num5 = numArray[4] % 10;
          uint num6 = numArray[5] % 10;
          uint[6] memory finalNumbers = [num1, num2, num3, num4, num5, num6];
          for (uint i = 0; i < finalNumbers.length; i++){
                if (finalNumbers[i] == 0) {
                    finalNumbers[i] = 1;
                }
          }
       _lotteries[currentLotteryId].winningNumbers = finalNumbers;
       _lotteries[currentLotteryId].totalPayout = _lotteries[currentLotteryId].transferJackpot;
   }

    function sortArrays(uint[6] memory numbers) internal pure returns (uint[6] memory) {
            bool swapped;
        for (uint i = 1; i < numbers.length; i++) {
            swapped = false;
            for (uint j = 0; j < numbers.length - i; j++) {
                uint next = numbers[j + 1];
                uint actual = numbers[j];
                if (next < actual) {
                    numbers[j] = next;
                    numbers[j + 1] = actual;
                    swapped = true;
                }
            }
            if (!swapped) {
                return numbers;
            }
        }
        return numbers;
    }
   
   function countWinners(uint[6] memory array, uint256 _lottoId) external onlyOwner {
       require(_lotteries[_lottoId].status == Status.Close, "Lottery not close");
       require(_lotteries[_lottoId].status != Status.Claimable, "Lottery Already Counted");
       delete numberWinner;
       uint256 firstTicketId = _lotteries[_lottoId].firstTicketId;
       uint256 lastTicketId = _lotteries[_lottoId].lastTicketId;
       uint[6] memory winOrder;
       winOrder = sortArrays(array);
       bytes32 encodeWin = keccak256(abi.encodePacked(winOrder));
       uint256 i = firstTicketId;
        for (i; i < lastTicketId; i++) {
            address buyer = _tickets[i].owner;
            uint[6] memory userNum = _tickets[i].chooseNumbers;
            bytes32 encodeUser = keccak256(abi.encodePacked(userNum));
              if (encodeUser == encodeWin) {
                  numberWinner++;
                  _lotteries[_lottoId].winnerCount = numberWinner;
                  _winnersPerLotteryId[buyer][_lottoId] = 1;
              }
        }
        if (numberWinner == 0){
            uint256 nextLottoId = (currentLotteryId).add(1);
            _lotteries[nextLottoId].transferJackpot = _lotteries[currentLotteryId].totalPayout;
        }
    _lotteries[currentLotteryId].status = Status.Claimable;
   }

   function claimPrize(uint256 _lottoId) external nonReentrant {
        require(_lotteries[_lottoId].status == Status.Claimable, "Not Payable");
        require(_lotteries[_lottoId].winnerCount > 0, "Not Payable");
        require(_winnersPerLotteryId[msg.sender][_lottoId] == 1, "Not Payable");
        uint256 winners = _lotteries[_lottoId].winnerCount;
        uint256 payout = (_lotteries[_lottoId].totalPayout).div(winners);
        paytoken.safeTransfer(msg.sender, payout);
        _winnersPerLotteryId[msg.sender][_lottoId] = 0;
   }



/**
##############################################################################################
 */

   /**
   Chainlink VRFv2 Specific functions required in the smart contract for full functionality.
    */

    function getRequestStatus(
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[lastRequestId].exists, "request not found");
        RequestStatus memory request = s_requests[lastRequestId];
        return (request.fulfilled, request.randomWords);
    }


    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
    }

    /**
    Lottery additional functions.
     */

   function viewTickets(uint256 ticketId) external view returns (address, uint[6] memory) {
        address buyer;
        buyer = _tickets[ticketId].owner;
        uint[6] memory numbers;
        numbers = _tickets[ticketId].chooseNumbers;
        return (buyer, numbers);
    }

    function viewLottery(uint256 _lotteryId) external view returns (Lottery memory) {
        return _lotteries[_lotteryId];
    }

    function getBalance() external view onlyOwner returns(uint256) {
        return paytoken.balanceOf(address(this));
    }

    function fundContract(uint256 amount) external onlyOwner {
        paytoken.safeTransferFrom(address(msg.sender), address(this), amount);
    }

    function withdraw() public onlyOwner() {
      paytoken.safeTransfer(address(msg.sender), (paytoken.balanceOf(address(this))));
    }

}