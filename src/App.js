import './App.css';
import Main from './components/Main.jsx';
import React, { Component } from "react";
import { Global } from './components/Global/Global';

class App extends Component{
  render(){
    return (
      <div className="App">
        <Global/>
        <Main />
      </div>
    );
  }
  
}

export default App;
