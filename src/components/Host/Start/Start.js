import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Footer from '../Footer/Footer';
import styles from './Start.module.scss';
import { socket } from '../../Global/Global';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TimeLeftBar from '../../GameRoom1Components/time_left_bar'
import Room1 from '../../../pages/gameroom1/Room1'


export default class Start extends Component {
  constructor(props) {
    super();
    this.state = {
      pin: null,
      totalNumberOfQuestions: null,
      redirect: false,
      questions:[],
      game: {},
      nickname:"",
      googleId:null
    };
  }

  componentDidMount() {
    const queryString = require('query-string');
    const parsed = queryString.parse(this.props.location.search);
    const pin = parseInt(parsed.pin);
    const nickname = parsed.nickname;
    const id = parsed.id;
    this.setState({
      pin: pin,
      nickname:nickname,
      googleId: id
    })
    socket.emit("reconnect", id, this.state.pin);
    //pings pin and host name for current game
    socket.emit("PING_START", pin,nickname);

    //Used to receive info not anymore
    socket.on("PONG_START", () => {
      console.log("received")
      this.id = setTimeout(() => {
        console.log("TIMEOUT");
        this.setState({ redirect: true })
      }, 5000);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.id);
    socket.off("PONG_START");
  }


  render() {

    const { quizName, totalNumberOfQuestions, quizId, pin } = this.state;

    if (quizName === null) {
      return null
    }

    return (
      <Switch> 
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid
          item
          container
          justify="center"
          alignItems="center"
          xs={12}
          style={{ minHeight: "15vh" }}
          className={ styles.title }
        >
          <h1>{ quizName }</h1>
        </Grid>
        <Grid
          item
          container
          direction="column"
          xs={12}
          alignItems="center"
          justify="center"
          style={{ minHeight: "75vh" }}
          className={ styles.main }
        >
          {/* <div className={ styles.questions }>{ totalNumberOfQuestions } Questions</div> */}
          <div>Are you ready?</div>
        </Grid>
        <Footer pin={ this.state.pin } />
        {
          this.state.redirect ?
          <Redirect to={`/room?&pin=${ this.state.pin }&id=${this.state.googleId}&nickname=${ this.state.nickname }`} />

          : null
          }
          {/* <Card className={classes.root}>
                  <TimeLeftBar
                      room_id={props.room_id}
                      timeleft={props.timeleft}
                      maxTime={5}
                  />
              </Card> */}
      </Grid>
      </Switch>
    )
  }
}
