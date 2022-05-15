import React, { Component } from "react";
import "../styles/styles.css";
import 'bootstrap/dist/css/bootstrap.css';
import styles from './styles/Play.module.scss';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider, createTheme, withStyles  } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import grey from '@material-ui/core/colors/grey';
import { socket } from '../components/Global/Global';
// var qs = require('qs');
const darkGreyTheme = createTheme({
    palette: {
      primary: {
        main: grey[900]
      }
    }
  });
const JoinGameInput = withStyles(theme => ({
    root: {
      '& input:invalid + fieldset': {
       borderColor: 'red',
       borderWidth: 2,
     },
   },
    input: {
      margin: "1rem 0",
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      border: '2px solid #ced4da',
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 16,
      padding: '10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        borderColor: theme.palette.common.black
      },
      '&:focus': {
        borderColor: theme.palette.common.black
      },
    },
  }))(InputBase);

class Play extends Component {
    static propTypes = {
        // make prop for function that populates div, passed in by main
        // buttonLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
        // active: PropTypes.string.isRequired,
        // onClick: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            active: 'Play',
            showModal: false,
            loggedIn: false,
            loading: false,
            error: null,
            recoverPasswordSuccess: null,
            givenName:localStorage.getItem('givenName'),
            email:'',
            googleId:'',
            sessionId:'1234',
            nickname:'',
            pin: '',
            hostname: '',
            googleId:localStorage.getItem('googleID')
          };
    }

    onClick = (newActive) => {
        console.log(newActive);
        this.setState({
            active: newActive,
        });
    };

    handleChange = event => {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
      };


    handleSubmit = event => {
        event.preventDefault();
        socket.emit("PLAYER_JOINED", {
          nickname: this.state.nickname,
          pin: parseInt(this.state.pin),
          playerId:this.state.googleId
        });
      };

      handleHostSubmit = event => {
        event.preventDefault();
        socket.emit("HOST_JOINED",  this.state.sessionId, this.state.hostname, this.state.googleId, );
      };

    componentDidMount() {
        document.querySelector('.navbar-wrapper').style.display = "block";
        const queryString = require('query-string');
        const parsed = queryString.parse(this.props.location.search);
        const reload = parsed.reload;
        if(reload){
          this.props.history.push('/play')
          window.location.reload();
        }
        socket.on("NICKNAME_TAKEN", () => {
          this.setState({
            message: "Nickname taken"
          })

          setTimeout(() => this.setState({
            message: null
          }), 3000);
        })
        socket.on("GAME_NOT_FOUND", () => {
          this.setState({
            message: "Not found"
          })
          setTimeout(() => this.setState({
            message: null
          }), 3000);

        });
        socket.on("PLAYER_JOINED_SUCCESSFULLY", data => {
            this.props.history.push(`/instructions?&pin=${ this.state.pin}&nickname=${ this.state.nickname }&id=${this.state.googleId}`)
        })
        socket.on("SHOW_PIN", data => {
          this.props.history.push(`/lobby?&pin=${data.pin}&nickname=${this.state.hostname}&id=${this.state.googleId}`)
      })
      //Test purposes
      // let id = Math.floor(Math.random()*80000000) + 10000000;
      // this.setState({
      //   googleId: id
      // })
    }

    render() {
        let error;
        if (this.state.message === null) {
        error = null
        } else if (this.state.message === "Not found") {
        error = <div className={ styles.error }><div>We didn't recognise the game pin.</div>Please check and try again.</div>
        } else if (this.state.message === "Nickname taken") {
        error = <div className={ styles.error }>Sorry, that nickname is taken.</div>
        }
        return (

            <div className='sw-body'>
                <div>
                    Welcome! {this.state.givenName}
                    <br/>
                    Logged in with google ID: {this.state.googleId}
                </div>
                <div className='play-body'>
                <div>
            <h1 className={ styles.mainTitle }>GAME</h1>
          </div>
          <div className={ styles.verticalMainForm }>
            <form onSubmit={ this.handleSubmit }>
              <JoinGameInput
                placeholder="NICKNAME"
                name="nickname"
                onChange={ this.handleChange }
                margin="dense"
                variant="outlined"
                required
                fullWidth
              />
              <JoinGameInput
                placeholder="GAME PIN"
                name="pin"
                onChange={ this.handleChange }
                margin="dense"
                variant="outlined"
                required
                fullWidth
              />
              <MuiThemeProvider theme={ darkGreyTheme }>
                <Button
                  style={{
                    fontSize: "1.6rem",
                    textAlign: "center",
                    fontWeight: "bold",
                    margin: "1rem 0"
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={ this.state.disabled }
                  fullWidth
                  className={ styles.enterBtn }
                >
                  JOIN GAME
                </Button>
              </MuiThemeProvider>
            </form>
          </div>
          <p>or</p>
                  <form onSubmit={this.handleHostSubmit}>
                  <JoinGameInput
                        placeholder="HOST NICKNAME"
                        name="hostname"
                        onChange={ this.handleChange }
                        margin="dense"
                        variant="outlined"
                        required
                        fullWidth
                      />
                    {/* <Link to={`/lobby?sessionId=${ this.state.sessionId }`}> */}
                        <Button
                        style={{
                            fontSize: "1.6rem",
                            textAlign: "center",
                            fontWeight: "bold",
                            margin: "1rem 0",
                        }}
                        variant="contained"
                        color="primary"
                        type="submit"
                        className={ styles.hostGameBtn }
                        >
                        Create Game
                        </Button>
                    {/* </Link> */}
                    </form>
                </div>
            </div>
        );
    }
}

export default Play;
