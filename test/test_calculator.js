const { assert } = require('chai');

const Calculator = artifacts.require("Calculator");

require('chai')
.use(require('chai-as-promised'))
.should()

contract('calculator', (accounts) => {
    let calculator

    before(async() =>{
        calculator = await Calculator.deployed()
    })

    describe('deployment', async () =>{
        it('deploys successfully', async() => {
            const address = calculator.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('obtain the right message', async() =>{
            const message = await calculator.name()
            const expected = 'Dapp Caltor!'
            assert.equal(message, expected)
        })
    })

    describe('calculation', async() => {

        describe('plus', async() => {
            it('can calculate plus', async() => {
                let answer, remainder, expected
                expected = 8
    
                await calculator.plus(3,5)
                answer = await calculator.answer()
                remainder = await calculator.remainder()
                //console.log(answer.toString(), remainder.toString())
                assert.equal(answer, expected)
                assert.equal(remainder, 0)
            })
        })

        describe('minus', async() => {
            it('can calculate when a>=b', async() => {
                let answer, remainder, expected
                expected = 0

                await calculator.minus(5,5)
                answer = await calculator.answer()
                remainder = await calculator.remainder()
                //console.log(answer.toString(), remainder.toString())
                assert.equal(answer, expected)
                assert.equal(remainder, 0)
            })

            it('reject when a<b', async() => {
                await calculator.minus(4,5).should.be.rejected  
            })
        })

        describe('multiply', async() => {
            it('can calculate multiply', async() => {
                let answer, remainder, expected
                expected = 28

                await calculator.multiply(4,7)
                answer = await calculator.answer()
                remainder = await calculator.remainder()
                //console.log(answer.toString(), remainder.toString())
                assert.equal(answer, expected)
                assert.equal(remainder, 0)
            })
        })  

        describe('divide', async() => {
            it('can divide when no remainder', async() => {
                let answer, remainder, expected
                expected = 5

                await calculator.divide(15,3)
                answer = await calculator.answer()
                remainder = await calculator.remainder()
                //console.log(answer.toString(), remainder.toString())
                assert.equal(answer, expected)
                assert.equal(remainder, 0)
            })

            it('can divide when has remainder', async() => {
                let answer, remainder, expected, expectedRemainder
                expected = 5
                expectedRemainder = 1

                await calculator.divide(16,3)
                answer = await calculator.answer()
                remainder = await calculator.remainder()
                //console.log(answer.toString(), remainder.toString())
                assert.equal(answer, expected)
                assert.equal(remainder, expectedRemainder)
            })
        })  

    })


})