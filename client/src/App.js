import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import TodoListContract from "./contracts/TodoList.json"
import getWeb3 from "./utils/getWeb3";
import TodoList from "./TodoList";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storageValue: 0, 
      web3: null, 
      account: null, 
      contract: null, 
      tasks:[], 
      loading: true,
      taskCount: null 
    }

    this.createTask = this.createTask.bind(this)
    this.toggleCompleted = this.toggleCompleted.bind(this)
  }

  componentWillMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TodoListContract.networks[networkId];
      const instance = new web3.eth.Contract(
        TodoListContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const taskCount = await instance.methods.taskCount().call();
      this.setState({taskCount: taskCount});
      console.log(taskCount);

      for (var i = 1; i <= taskCount; i++) {
        const task = await instance.methods.tasks(i).call()
        this.setState({
          tasks: [...this.state.tasks, task]
        })
      }
      this.setState({loading: false});
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3: web3, account: accounts[0], contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  createTask(content) {
    this.setState({ loading: true })
    this.state.contract.methods.createTask(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      console.log(receipt)
      const task = receipt.events.TaskCreated.returnValues;
      this.setState({
        tasks: [...this.state.tasks, task]
      })
      this.setState({ loading: false })
    })
  }

  toggleCompleted(taskId) {
    this.setState({ loading: true })
    this.state.contract.methods.toggleCompleted(taskId).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.state.tasks[receipt.events.TaskCompleted.returnValues.id-1].completed = 
      receipt.events.TaskCompleted.returnValues.completed;
      this.forceUpdate()
      this.setState({ loading: false })
    })
  }

  render() {

    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small><a className="nav-link" href="#"><span id="account"></span></a></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
            { this.state.loading
                ?   <div class="ui active dimmer">
                  <div class="ui huge text loader">Loading</div>
                  </div>
                : <TodoList
                  loading={this.state.loading}
                  tasks={this.state.tasks}
                  createTask={this.createTask}
                  toggleCompleted={this.toggleCompleted} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
