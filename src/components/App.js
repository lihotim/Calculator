import React, { Component } from 'react';
import Web3 from 'web3'
import Calculator from '../abis/Calculator.json'
import icon from '../icon.png';
import './App.css';

class App extends Component {

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {

    const web3 = window.web3

    //load accounts, fetch account's ETH balance
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // const ethBalance = await web3.eth.getBalance(this.state.account)
    // this.setState({ ethBalance })

    // fetch the '5777' value
    const networdId = await web3.eth.net.getId()

    // Load Calculator smart contract
    const networkData = Calculator.networks[networdId]
    if(networkData){
      const calculator = new web3.eth.Contract(Calculator.abi, networkData.address)
      this.setState({ calculator })

      const message = await calculator.methods.name().call()
      this.setState({ message })

      const answer = await calculator.methods.answer().call()
      this.setState({ answer: answer.toString()})

      const remainder = await calculator.methods.remainder().call()
      this.setState({ remainder: remainder.toString() })

    }else{
      window.alert('Calculator contract not deployed to detected network.')
    }

    this.setState({loading:false})
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      account:'',
      calculator: {},
      message:'',
      // a: 0,
      // b: 0,
      operator: '?',
      answer: 0,
      remainder: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.plus = this.plus.bind(this)
  }

  handleChange(event) {
    this.setState({
      operator: event.target.value
    });
  }
  
  plus = (a,b) => {
    this.setState({loading:true})
    this.state.calculator.methods.plus(a,b).send({from: this.state.account}).on('transactionHash', async (hash) => {
      this.setState({loading:false })
    })
  }

  minus = (a,b) => {
    this.setState({loading:true})
    this.state.calculator.methods.minus(a,b).send({from: this.state.account}).then('receipt', (receipt) => {
      this.setState({loading:false})
    });
  }

  multiply = (a,b) => {
    this.setState({loading:true})
    this.state.calculator.methods.multiply(a,b).send({from: this.state.account}).then('receipt', (receipt) => {
      this.setState({loading:false})
    });
  }

  divide = (a,b) => {
    this.setState({loading:true})
    this.state.calculator.methods.divide(a,b).send({from: this.state.account}).then('receipt', (receipt) => {
      this.setState({loading:false})
    });
  }

  render() {

    let content
    if(this.state.loading){
      content = <p id="loader" className="text-center"> Loading... </p>
      
    } else {
      content = 
      <div className="content mr-auto ml-auto">
      <a
        href="http://google.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={icon} className="App-icon" alt="icon" width="200"/>
      </a>
      <h1>This is a Dapp Calculator.</h1>
      <hr/>

      <form onSubmit={(event) => {
        event.preventDefault()
        let a,b
        a = this.a.value
        b = this.b.value

        if(this.op.value === 'plus'){
          this.plus(a,b)
        } else if(this.op.value === 'minus') {
          this.minus(a,b)
        } else if(this.op.value === 'multiply') {
          this.multiply(a,b)
        } else if(this.op.value === 'divide') {
          this.divide(a,b)
        }
        
      }}>
        <label>
          <p>Input two numbers and pick an operator:</p>
          <input id="a" 
            type="number" 
            placeholder="Number A"
            ref={(input) => { this.a = input }}
            // onChange={(event) => {
            //   const numA = this.a.value.toString()
            //   this.setState({ a: numA })
            //  }}
          />
          
          <select className="mx-1" value={this.state.operator} onChange={this.handleChange} ref={(input) => { this.op = input }}>
            <option value="?" defaultValue hidden>?</option>
            <option value="plus">+</option>
            <option value="minus">-</option>
            <option value="multiply">*</option>
            <option value="divide">/</option>
          
          </select>
          <input id="b" 
            type="number" 
            placeholder="Number B"
            ref={(input) => { this.b = input }}
            // onChange={(event) => {
            //   const numB = this.b.value.toString()
            //   this.setState({ b: numB })
            //  }}
          />
        </label>
        <br/>
        <input type="submit" value="Calculate" className="btn btn-primary"/>
      </form>

      <hr/>
      {/* <h4> Calculate: {this.state.a} {this.state.operator} {this.state.b}</h4> */}
      <h4> Answer: {this.state.answer}, Remainder: {this.state.remainder}</h4>
     
    </div>
    }
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp Calculator
          </a>

          <div>
                <ul className="navbar-nav px-3">
                    <li className="nav-item flex-nowrap d-none d-sm-none d-sm-block">
                        <small className="navbar-text">
                            Your account: {this.state.account}
                        </small>
                    </li>
                </ul>

            </div>
        </nav>
        
        
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              {content}
            </main>
          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
