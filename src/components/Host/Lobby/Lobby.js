import React, { Component, useEffect } from 'react';
import styles from './Lobby.scss';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { socket } from '../../Global/Global';
import theme from '../Music/theme.mp3';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { Prompt } from 'react-router'

export default class Lobby extends Component {
  constructor(props) {
    super();
    this.state = {
      sessionId: null,
      googleId: null,
      pin: null,
      players: null,
      playersCount: null,
      disabled: true,
      muted: false,
      nickname:"",
      game1_timelimit:90,
      game1_rounds:6

    };
  }

  componentDidMount() {
    //set navigation bar to not display
    document.querySelector('.navbar-wrapper').style.display = "none";
    
    const queryString = require('query-string');
    const parsed = queryString.parse(this.props.location.search);
    const nickname = parsed.nickname;
    const pin= parsed.pin;
    const id = parsed.id;
    this.setState({
      pin:pin,
      googleId:id,
      nickname:nickname,
      players:[{
        "nickname":nickname
      }],
      playersCount:1
    });
    // console.log(this.state.sessionId);
    // console.log(this.state.pin);
    // console.log(nickname);

    // socket.emit("HOST_JOINED", sessionId);
    socket.emit("reconnect", id, pin);
    // socket.emit("ASK_FOR_PLAYERS", id, pin);
    socket.on("UPDATE_PLAYERS_IN_LOBBY", playersData => {
      console.log(playersData);
      if (playersData.playersCount === 0) {
        this.setState({
          players: null,
          playersCount: null
        })
      } else if(playersData.pin==pin){
        this.setState({
          players: playersData.players,
          playersCount: playersData.playersCount,
          disabled: false
        })
      }
    })
  }

  handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleMusic = event => {
    event.preventDefault();
    this.setState({
      muted: !this.state.muted
    })
  }

  startGame = event => {
    event.preventDefault();
    socket.emit("HOST_STARTED_GAME", this.state.googleId, this.state.pin, this.state.game1_timelimit, this.state.game1_rounds);
    this.props.history.push(`/start?&pin=${ this.state.pin }&nickname=${this.state.nickname}&id=${this.state.googleId}`);
  }

  componentWillUnmount() {
    socket.off("SHOW_PIN");
    socket.off("UPDATE_PLAYERS_IN_LOBBY");
  }


  render() {
    let name;
    if (this.state.playersCount === 1) {
      name = <span>Player</span>
    } else {
      name = <span>Players</span>
    }

    let button;
    if (!this.state.muted) {
      button = <button onClick={ this.handleMusic }><VolumeUpIcon /></button>
    } else {
      button = <button onClick={ this.handleMusic }><VolumeOffIcon /></button>
    }

    return (
      <div className={ styles.main }>
        <div className={ styles.music }>
          { button }
        </div>
        <div>
          <audio ref="audio_tag" src={ theme } autoPlay muted={ this.state.muted }/>
        </div>
        <Grid
          container
          direction="column"
        >
          <Grid
            item
            container
            justify="center"
            alignItems="center"
            xs={12}
            style={{ minHeight: "20vh" }}
            className={ styles.statusBar }
          >
            <div className={ styles.title }>
              <div className={ styles.gamePin }>with Game PIN:</div>
              <div className={ styles.pin }>{ this.state.pin }</div>
            </div>
          </Grid>
          <Grid
            item
            container
            xs={12}
            direction="row"
            justify="space-between"
            alignItems="center"
            style={{ minHeight: "10vh", marginTop: "30px" }}
          >
            <Grid
              item
              xs={4}
              style={{ paddingLeft: "5rem" }}
            >
              <div className={ styles.left }>
                <div className={ styles.playersCounter }>
                  <div className={ styles.count }>
                    { this.state.playersCount || 0 }
                  </div>
                  <div className={ styles.player }>
                    { name }
                  </div>
                </div>
              </div>
            </Grid>
            <Grid
              item
              xs={4}
              style={{ textAlign: "center" }}
            >
              <h1 className={ styles.logo }>SQUARE WHEELS</h1>
            </Grid>
            <Grid
              item
              xs={4}
              style={{ textAlign: "right", paddingRight: "50px" }}
            >
              <form  onSubmit={ this.startGame } >
                <input type="number" name="game1_timelimit" placeholder="Seconds Per Round" onChange={this.handleChange} required></input>
                <input type="number" name="game1_rounds" placeholder="Number of Rounds" onChange={this.handleChange} required></input>
                {/* <Link to={`/start?&pin=${ this.state.pin }&nickname=${this.state.nickname}&id=${this.state.googleId}`}> */}
                  <Button type="submit" variant="contained" color="primary" className={ styles.startBtn }style={{ fontSize: "1.6rem" }}>
                    Start
                  </Button>
                {/* </Link> */}
              </form>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Players players={ this.state.players } playersCount={ this.state.playersCount }/>
          </Grid>
          <Grid>

          </Grid>
        </Grid>
      </div>
    )
  }
}

const Players = (props) => {

  if (props.players === null || props.playersCount === null) {
    return null
  }

  const playerNames = props.players.map((p, i) => (
    <div key={ p._id }>
      { p.nickname }
    </div>
  ))

  return (
    <div className={ styles.names }>
      { playerNames }
    </div>
  )
}