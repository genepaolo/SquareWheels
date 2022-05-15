import React, { Component } from 'react';
import StatusBar from '../StatusBar/StatusBar';
import { Redirect, useHistory } from 'react-router-dom';
import { socket } from '../../Global/Global';
import styles from './Instructions.module.scss';
import Grid from '@material-ui/core/Grid';

export default class Instructions extends Component {
  constructor() {
    super();
    this.state = {
      nickname: null,
      pin: null,
      googleId:null,
      redirect: false,
      hostDisconnected: false,
      redirect:false
    };
  }

  componentDidMount() {
    document.querySelector('.navbar-wrapper').style.display = "none";
    const queryString = require('query-string');
    const parsed = queryString.parse(this.props.location.search);
    const nickname = parsed.nickname;
    const pin = parseInt(parsed.pin);
    const id = parsed.id;
    this.setState({
      nickname: nickname,
      pin: pin,
      googleId:id
    })
    socket.emit("ASK_FOR_PLAYERS", id, pin);
    socket.on("GAME_HAS_STARTED", () => {
      this.setState({
        redirect: true
      })
   })

    socket.on("HOST_DISCONNECTED", () => {
      alert("Host has disconnected");
      clearTimeout(this.id);
      this.setState({
        hostDisconnected: true
      })
      this.props.history.push('/play?&reload=true');
    })

    socket.on("PONG_START", () => {
      console.log("received")
      this.id = setTimeout(() => {
        console.log("TIMEOUT");
        this.setState({ redirect: true })
      }, 5000);
    });

  }

  

  componentWillUnmount() {
    socket.off("GAME_HAS_STARTED");
    clearTimeout(this.id);
    socket.off("PONG_START");
  }

  render() {

    const { pin, nickname } = this.state;

    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        <StatusBar
          pin={ pin }
          nickname={ nickname }
        />
        <Grid
          item
          container
          xs={12}
          spacing={4}
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: "90vh" }}
          className={ styles.mainInfo }
        >
          <Grid
            item
            xs={12}
            className={ styles.in }
          >
            You're in
          </Grid>
          <Grid
            item
            xs={12}
            className={ styles.name }
          >
            Wait for host to start
          </Grid>
        </Grid>
        {
          this.state.redirect ?
          <Redirect to={`/room?&pin=${ this.state.pin }&id=${this.state.googleId}&nickname=${ this.state.nickname }`} />

          : null
          }
        {/* {
          this.state.hostDisconnected ?
          <Redirect to='/play' />
          : null
        } */}
      </Grid>
    )
  }
}
