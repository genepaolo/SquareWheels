import { Component } from 'react';
import io from 'socket.io-client';

let socket;

class Global extends Component {
  constructor() {
    super();
    this.state = {
      //endpoint: 'https://squarewheels.herokuapp.com/'
      endpoint: 'http://localhost:3001'
    };
  socket = io(this.state.endpoint, {
    maxHttpBufferSize: 1e8    // 100 MB
});
  }

  render() {
    return null
  }
}

export { Global, socket};