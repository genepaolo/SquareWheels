import React from 'react'
import GridRoom from './grid-room'
import { socket } from '../../components/Global/Global';
import * as html2canvas from 'html2canvas';


export default class Room1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatMsgs:[],
            pin:this.props.match.params.id,
            activeusers:{}, //[user:score]
            timeleft:[],
            time_is_up:false,
            drawer:"",
            currentQuestion:"",
            four_questions:[],
            game_ended:false,
            timer:null,
            guessed_correctly:false,
            nickname:null,
            googleId:null,
            game:{},
            questions:[],
            users:[],
            discussion:false,
            hostname:"",
            next_drawer:"",
            //email we sent results to
            email:null,
            group:null,
            round:1
        };
    }

    handleSendResults = (event) =>{
        event.preventDefault();
        // console.log("send results");
        html2canvas(document.querySelector("#results"),{scale:1}).then(canvas => {
            // console.log(this.state.email)
            // console.log(this.state.group)
            // console.log(canvas.toDataURL("image/jpeg,0.9"));
            // console.log(this.state.pin);
            // console.log(this.state.pin,this.state.group,this.state.email, canvas.toDataURL("image/jpeg,0.9"));
            // socket.emit("reconnect");
            // socket.emit("sendResultsPage", this.state.pin,this.state.group,this.state.email, canvas.toDataURL("image/jpeg,0.9"))
            let databody = {
                email: this.state.email,
                pin:this.state.pin,
                group:this.state.group,
                file:canvas.toDataURL("image/jpeg,0.9")
            }
            fetch('http://localhost:3001/supervisor/group/'+this.state.email, {
                method: 'PUT',
                body: JSON.stringify(databody),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(res => res.json())
            .then(data => console.log(data))

        });
        // alert("Sent results to " + this.state.email)
    }

    handleChange = event => {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({
          [name]: value
        });
      };

    componentDidMount() {
        // window.addEventListener("beforeunload", this.onUnload)
        const queryString = require('query-string');
        const parsed = queryString.parse(this.props.location.search);
        const pin = parseInt(parsed.pin);
        const nickname = parsed.nickname;
        const id = localStorage.getItem("googleID");
        this.setState({
            pin: pin,
            nickname:nickname,
            googleId:id
        })
        if(!socket)
            this.props.history.push("/")
        else{
            //set up needed variables
            socket.emit("REQUEST_GAME_INFO", pin);
            //NEED TO UPDATE GAME EVENTUALLY

            socket.emit("reconnect", id, pin);
            //Used to receive info not anymore
            socket.on("RECEIVE_GAME_INFO", (game,questions) => {
                // console.log("received")
                this.setState({
                    game: game,
                    questions:questions,
                    game_ended:game.game_ended,
                    round:1
                });
                // console.log(game.users);
                
            });
            // console.log("connected to room")
            if(!this.state.game_ended){
                console.log("connected to room")
                socket.emit('JOIN_GAME_ROOM1' ,pin,nickname);
            }
            
            socket.on('userConnected',(nickname)=>{
                const chatMsgs=this.state.chatMsgs.concat([{"": nickname +" connected to room"}])
                this.setState({chatMsgs:chatMsgs})
                console.log(nickname +" connected to room")
            });
            socket.on('userDisonnected',(nickname)=>{
                const chatMsgs=this.state.chatMsgs.concat([{"":nickname +" disconnected to room"}])
                this.setState({chatMsgs:chatMsgs})
                console.log(nickname +" disconnected to room")
            });

            socket.on('chatter',(nickname,message)=>{
                let obj={};
                obj[nickname]=message;
                const chatMsgs=this.state.chatMsgs.concat([obj])
                this.setState({chatMsgs:chatMsgs})
            });

            socket.on('setTimeLeft',(timeleft,currentQuestion,round)=>{
                this.setState({timeleft:timeleft,currentQuestion:currentQuestion,round})
                function updateTime() {
                    let timeleft= this.state.timeleft-1;
                    this.setState({timeleft:timeleft})
                }
                this.setState({timer:setInterval(updateTime.bind(this), 1000)})
            });
            // socket.on('timeUp',(drawer,four_questions)=>{
            //     const chatMsgs=this.state.chatMsgs.concat([{"":"Drawer is : "+drawer}])
            //     this.setState({chatMsgs, time_is_up:true,game_ended:false, drawer, four_questions, guessed_correctly:false})
            // });
            socket.on('timeUp',(round)=>{
                console.log("timeout");
                //save results from end of discussion
                var results = document.getElementById("results");
                html2canvas(document.querySelector("#capture-canvas")).then(canvas => {
                results.appendChild(canvas);
                });
                const chatMsgs=this.state.chatMsgs.concat([{"":"Drawer is : "+this.state.new_drawer}])
                this.setState({chatMsgs, time_is_up:true,discussion:false, drawer:this.state.new_drawer,round})
            });
            socket.on('discussionStart', (drawer,four_questions) =>{
                console.log("DISCUSSION");
                const chatMsgs=this.state.chatMsgs.concat([{"":"Discussion Time, Host Will Proceed To Next Round"}])
                this.setState({chatMsgs, time_is_up:false,game_ended:false, new_drawer:drawer, four_questions,discussion:true})
            });
            socket.on('startGame1',(drawer,four_questions,hostname,game_ended)=>{
                const chatMsgs=this.state.chatMsgs.concat([{"":"Drawer is : "+drawer}])
                console.log(drawer);
                console.log(four_questions);
                this.setState({chatMsgs, time_is_up:true,game_ended, drawer, four_questions,hostname})
            });
            socket.on('endGame1',()=>{
                socket.off("updateDrawnQuestion");
                socket.off('JOIN_GAME_ROOM1');
                socket.off('userConnected');
                socket.off('chatter');
                socket.off('setTimeLeft');
                socket.off('startGame1');
                socket.off('timeUp');
                socket.off('discussionStart');

                document.querySelector('.navbar-wrapper').style.display = "block";

                //add the last drawing 
                var results = document.getElementById("results");
                // console.log("endgame");
                html2canvas(document.querySelector("#capture-canvas"),{scale:1}).then(canvas => {
                    results.appendChild(canvas);
                });

                const chatMsgs=this.state.chatMsgs.concat([{"":"End of game."}])
                this.setState({chatMsgs:chatMsgs, game_ended:true, time_is_up:null})
                var results = document.getElementById("results");
                results.style.display='block';
                if(this.state.hostname===this.state.nickname){
                    var div = document.getElementById("send-results-div");
                    div.style.display="block";
                }
                
                
            });
            socket.on('restartRound',(maxTime,currentQuestion)=>{
                if(!this.state.game_ended){
                    console.log("restartRound")
                    this.setState({timeleft:maxTime, time_is_up:false, maxTime:maxTime, currentQuestion:currentQuestion})
                }
                
            });
        }
    }
    componentWillUnmount(){
        clearInterval(this.state.timer)
    }

    render() {
        let game = <div>Loading</div>;
        if(Object.keys(this.state.game).length != 0 && !this.state.game_ended){
            game = <GridRoom
            pin={this.state.pin}
            chatMsgs={this.state.chatMsgs}
            timeleft={this.state.timeleft}
            drawer={this.state.drawer}
            questions={this.state.questions}
            time_is_up={this.state.time_is_up}
            maxTime={this.state.maxTime}
            currentQuestion={this.state.currentQuestion}
            four_questions={this.state.four_questions}
            game_ended={this.state.game_ended}
            round={this.state.round}
            maxRounds={this.state.game.maxRounds}
            user={this.state.nickname}
            users={this.state.game.users}

            guessed_correctly={this.state.guessed_correctly}
            discussion={this.state.discussion}
            hostname={this.state.hostname}
            
        />;
            
        }else{
            game = <div></div>
        }
        return (
            <>
                {game}
                
                <div id="results" style={{display:"none"}}></div>
                <div id="send-results-div" style={{display:"none"}}>
                    {/* <form onSubmit={e => this.handleSendResults(e)}> */}
                        <input
                        placeholder="Supervisor Squarewheels email to send to"
                        name="email"
                        onChange={ this.handleChange }
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        required
                        />
                        <input
                        placeholder="Group Name"
                        name="group"
                        onChange={ this.handleChange }
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        required
                        />
                        <br/>
                        <button type="button" onClick={e => this.handleSendResults(e)} >Send Results</button>
                    {/* </form> */}
                    
                </div>
                
                
            </>
        );
    }
}