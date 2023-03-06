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

CHAINLINK VRF INTEGRATION 
PART 1 Practice Contract

*/


pragma solidity ^0.8.7.0;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract N2DLotto is VRFConsumerBaseV2, Ownable {

    /*
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

    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
    }

    function closeLottery() external onlyOwner {

        /*
        Request Id Stores the ChainLink VRF request Id, this is fetched once we execute the function
        and from there we will obtain a random number that we can use to obtain the winning numbers.
        */
        uint256 requestId;

        /*
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
            fulfilled: false,
            exists: true,
            randomWords: new uint256[](0)
        });
        lastRequestId = requestId;
    }

    function getWinningNumbers() external view onlyOwner returns (uint[6] memory) {
       uint256[] memory numArray = s_requests[lastRequestId].randomWords;
       uint num1 = numArray[0] % 20;
       uint num2 = numArray[1] % 20;
       uint num3 = numArray[2] % 20;
       uint num4 = numArray[3] % 20;
       uint num5 = numArray[4] % 20;
       uint num6 = numArray[5] % 20;
       uint[6] memory finalNumbers = [num1, num2, num3, num4, num5, num6];
       return finalNumbers;
    }

    /*
   Chainlink VRFv2 Specific functions required in the smart contract for full functionality.
    */

    function getRequestStatus() external view returns (bool fulfilled, uint256[] memory randomWords) {
        require(s_requests[lastRequestId].exists, "request not found");
        RequestStatus memory request = s_requests[lastRequestId];
        return (request.fulfilled, request.randomWords);
    }


    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
    }

}