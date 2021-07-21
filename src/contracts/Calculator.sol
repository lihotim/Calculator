// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Calculator{
    string public name;
    uint public answer;
    uint public remainder;
    
    constructor() {
        name = "Dapp Caltor!";
        answer = 0;
        remainder = 0; 
    }
    
    function plus(uint _a, uint _b) public returns (uint, uint){
        answer = _a + _b;
        remainder = 0;
        return (answer, remainder);
    }
    
    function minus(uint _a, uint _b) public returns (uint, uint){
        answer = _a - _b;
        remainder = 0;
        return (answer, remainder);
    }
    
    function multiply(uint _a, uint _b) public returns (uint, uint){
        answer = _a * _b;
        remainder = 0;
        return (answer, remainder);
    }
    
    function divide(uint _a, uint _b) public returns (uint, uint){
        answer = _a / _b;
        remainder = _a % _b;
        return (answer, remainder);
    }
    
    function reset() public{
        answer = 0;
        remainder = 0; 
    }
    
}