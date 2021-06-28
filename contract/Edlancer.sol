//SPDX-License-Identifier: UNLICENSED
//Team-Nuvs
pragma solidity ^0.8.0;

//import "ABDKMathQuad.sol";

contract Edlancer{
    
    address edlanceProvider;
    
    constructor()public{
        edlanceProvider = msg.sender;    
    }
    
    function getContractBalance() public view returns(uint) {
        return address(this).balance;
    }
    
    struct Question{
        uint256 bounty;
        address user;
        bool pAnsed;
        bool eAnsed;
    }
    
    uint256 public qId;
    
    // mapping of qId to Question object
    mapping(uint256 => Question) public questions;
    
    event NewQuestion (
        uint256 indexed qId
    );
    
    function listQuestion(uint256 bounty) public payable{
        Question memory question = Question({
            bounty: bounty,
            pAnsed: false,
            eAnsed: false,
            user: msg.sender
        });
        
        require(msg.value==bounty,"Send the entered Bounty Amount");
        _sendFunds(msg.value);
        // Persist `question` object to the "permanent" storage
        questions[qId] = question;
        
        // emit an event to notify the clients
        emit NewQuestion(qId++);
        
        
        
    }
    
    function withdraw() public{
        require(
              msg.sender == edlanceProvider,
              'Only the service provider can withdraw the payment.'
            );
            payable(msg.sender).transfer(address(this).balance);
    }
    
    function ansedWithdrawl(uint _qID ,string memory mem, uint amount) public{
        if(keccak256(bytes(mem)) == keccak256(bytes("e"))){
            questions[_qID].eAnsed = true;
            payable(msg.sender).transfer(amount);
        }
        else if(keccak256(bytes(mem)) == keccak256(bytes("s"))){
            questions[_qID].pAnsed = true;
            payable(msg.sender).transfer(amount);
        }
    }
    
    
    
    fallback () payable external {}
  
    function _sendFunds (uint256 value) internal {
        payable(address(this)).transfer(value);
    }
      
    
}