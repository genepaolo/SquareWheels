import React, { Component } from 'react';
import {SliderPicker } from 'react-color'
import PenSlider from './pen-slider'
import eraser from '../Icons/eraser.svg'
import brush from '../Icons/paint-brush.svg'
import clear from '../Icons/clear.svg'
import text from '../Icons/text.svg'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { socket } from '../Global/Global';
import img from '../Icons/square-wheels.png';
import * as html2canvas from 'html2canvas';
class DrawingApp extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.display = React.createRef();
        this.handleClearClick=this.handleClearClick.bind(this)
        this.state = {
            brushColor: {r:0, g: 0, b: 0, a: 255},
            brushSize: 5,
            toolId: 'brush',
            isBrushDown: false,
            mouseX: 0,
            mouseY: 0,
            prevX: 0,
            prevY: 0,
            textInfo:{},
            textboxes:0
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted){
            socket.on('line', data => {
                const [x1,y1,x2,y2] = data.lineCoordinates;
                if (this.display.current){
                    const displayCtx = this.display.current.getContext('2d')
                    
                    displayCtx.lineWidth = data.lineWidth;
                    displayCtx.strokeStyle = `rgba(${data.lineColor.r},${data.lineColor.g},${data.lineColor.b},${data.lineColor.a})`;
                    displayCtx.beginPath();
                    displayCtx.moveTo(x1,y1);
                    displayCtx.lineTo(x2,y2);
                    displayCtx.stroke();
                }
            });

            socket.on('resetCanvas', () =>{
                if (this.display.current){
                    const displayCtx = this.display.current.getContext('2d');
                    displayCtx.clearRect(0, 0, displayCtx.canvas.width, displayCtx.canvas.height);
                    // var background = new Image();
                    // background.onload = function(){
                    //     console.log("clearing");
                    //     displayCtx.drawImage(background,0,0,displayCtx.canvas.width, displayCtx.canvas.height);
                    // }
                    // background.src = '../Icons/square-wheels.png';
                    // console.log(background);
                }
            })

            socket.on('text', data => {
                if (this.display.current){
                    console.log(this.display.current);
                    const displayCtx = this.display.current.getContext('2d')
                    const x = data.x;
                    const y = data.y;
                    const val = data.value;
                    displayCtx.fillStyle = "black";
                    displayCtx.font = "14px Arial";
                    displayCtx.fillText(val, x, y);
                }
            });
        }
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    handleToolClick(e,toolId) {
        if (toolId==="clear") {
            this.handleClearClick()
        }else {
            this.setState({toolId});
        }
    }
    handleClearClick() {
        socket.emit('resetCanvas',this.props.pin)
    }
    handleColorChange(color) {
        this.setState({brushColor: color.rgb});
    }

    handleOnTextChange = (e) => {
        e.preventDefault();
        // console.log(e.target.value);
        var canvas = document.getElementById("capture-canvas");
        var rect = canvas.getBoundingClientRect();
        // const displayCtx = this.display.current.getContext('2d');
        
        // console.log(parseInt(e.target.style.left,10));
        // console.log(parseInt(e.target.style.top,10));
        // console.log(rect.left);
        // console.log(rect.top);
        // displayCtx.fillText("hello", (displayCtx.canvas.width/2 + e.target.style.left), (displayCtx.canvas.height/2 + e.target.style.top));
        // displayCtx.fillText(e.target.value, e.target.style.left, e.target.style.top);
        // console.log(displayCtx.canvas.width/2);
        // console.log(displayCtx.canvas.height/2);
        // console.log(e.target.style.left-(rect.left+"px"));
        // console.log(e.target.style.top-(rect.top+"px"));
        socket.emit("text", {
            pin:this.props.pin,
            value: e.target.value,
            x:parseInt(e.target.style.left,10)-rect.left+1,
            y:parseInt(e.target.style.top,10) - rect.top+20
        })
        // displayCtx.fillText(e.target.value, parseInt(e.target.style.left,10)-rect.left+1, (parseInt(e.target.style.top,10) - rect.top+20));
        // console.log(e.target.id);

        //basically deleting/clearing textarea element
        
        document.getElementById(e.target.id).outerHTML = "";
        
    }

    handleDisplayMouseMove(e) {
        this.setState({
            mouseX: e.clientX,
            mouseY: e.clientY
        });
        if(this.state.isBrushDown && this.display.current) {
            this.display.current.getContext('2d').lineCap = 'round';
            const {top, left} = this.display.current.getBoundingClientRect();
            switch(this.state.toolId) {
                case 'brush':
                    socket.emit('line',{
                        pin:this.props.pin,
                        lineWidth: this.state.brushSize,
                        lineColor: this.state.brushColor,
                        lineCoordinates: [this.state.prevX - left, this.state.prevY - top, this.state.mouseX - left, this.state.mouseY - top],
                    });
                    break;
                case 'eraser':
                    socket.emit('line',{
                        pin:this.props.pin,
                        lineWidth: this.state.brushSize,
                        lineColor: {r: 255, g: 255, b: 255, a: this.state.brushColor.a},
                        lineCoordinates: [this.state.prevX - left, this.state.prevY - top, this.state.mouseX - left, this.state.mouseY - top],
                    });
                    break;
                default:
            }
        }
        this.setState({
            prevX: this.state.mouseX,
            prevY: this.state.mouseY
        });
        if(!this.state.isBrushDown) {
            this.setState({
                prevX: e.clientX,
                prevY: e.clientY
            });
        }
    }
    handleDisplayMouseDown(e) {
        if(!this.props.discussion && this.props.user===this.props.drawer){
            this.setState({isBrushDown: true});
            const {top, left} = this.display.current.getBoundingClientRect();
            switch(this.state.toolId) {
                case 'text':
                    var div = document.getElementById("capture-canvas");
                    var input = document.createElement("textarea");
                    input.name = "text";
                    input.maxLength = "5000";
                    input.rows = 5;
                    input.cols = 33;
                    input.style.zIndex = 10;
                    input.style.position = "absolute";
                    input.style.left = `${this.state.mouseX}px`;
                    input.style.top = `${this.state.mouseY}px`;
                    // input.style.left = this.state.mouseX;
                    // input.style.top = this.state.mouseY;
                    input.style.background = "transparent";
                    input.style.visibility = "show";
                    input.style.width = "200px";
                    input.style.border = "none";
                    input.style.outline = "none";
                    input.style.caretColor = "red";
                    input.id = "ta" + this.state.textboxes.toString();
                    this.setState({textboxes:this.state.textboxes+1});
                    input.addEventListener('change', this.handleOnTextChange);
                    div.insertBefore(input,div.firstChild);
                    break;
                default:
            }
        }
        
    }
    handleDisplayMouseUp(e) {
        this.setState({isBrushDown: false});
    }
    handleBrushResize(value) {
        this.setState({brushSize: value})
    }
    handleEndDiscussionButton(){
        socket.emit("discussionEnd", this.props.pin);
    }

    handleEndGame(){
        console.log("FORCE END");
        socket.emit("hostForceEnd", this.props.pin);
    }

    render() {
        return (
            <div>
                <Grid container direction="column" style={{border: "2px solid grey", borderRadius: "5px"}}>
                    { (this.props.discussion || !this.props.time_is_up)? 
                        <div >
                            <div id="capture-canvas">
                                <Grid item style={{backgroundImage: `url(${img})`,backgroundSize: 'cover', zIndex:9}}>
                                    <canvas id="canvas"
                                        width={"1100"}
                                        height={"450"}
                                        className="display"
                                        ref={this.display}
                                        onMouseMove={this.handleDisplayMouseMove.bind(this)}
                                        onMouseDown={this.handleDisplayMouseDown.bind(this)}
                                        onMouseUp={this.handleDisplayMouseUp.bind(this)}
                                        // background={"url('../Icons/square-wheels.png')"}
                                    />
                                </Grid>
                                
                                <Grid item>
                                    <Typography align={'center'}  component={'div'}> {/* component={'span'} cz error <div> cannot appear as a descendant of <p>.*/}
                                        Drawer: 
                                        <Box fontWeight="fontWeightBold" m={1} display={"inline"}>{this.props.drawer}</Box>
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography align={'center'}  component={'div'}> {/* component={'span'} cz error <div> cannot appear as a descendant of <p>.*/}
                                        Prompt: 
                                        <Box fontWeight="fontWeightBold" m={1} display={"inline"}>{this.props.currentQuestion}</Box>
                                    </Typography>
                                </Grid>
                            </div>
                            {(!this.props.discussion &&  this.props.user===this.props.drawer) ?
                                <div>
                                    <Grid item  >
                                        <SliderPicker width={'100%'} color={this.state.brushColor} onChange={this.handleColorChange.bind(this)} />
                                    </Grid>
                                    <Grid item >
                                        <div align="center" style={{marginTop:"15px"}}>
                                            <ToggleButtonGroup
                                                size="large"
                                                value={this.state.toolId}
                                                exclusive
                                                onChange={this.handleToolClick.bind(this)}
                                                aria-label="tools"
                                            >
                                                <ToggleButton value="brush" size={"small"}>
                                                    <img src={brush} alt="Brush" width={50}/>
                                                </ToggleButton>
                                                <ToggleButton value="eraser" >
                                                    <img src={eraser} alt="Eraser" width={50}/>
                                                </ToggleButton>
                                                <ToggleButton value="clear" >
                                                    <img src={clear} alt="Clear" width={50}/>
                                                </ToggleButton>
                                                <ToggleButton value="text" >
                                                    <img src={text} alt="Text" width={50}/>
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </div>
                                    </Grid>
                                    <Grid item className={this.props.class} >
                                        <PenSlider class={this.props.class} onChange={this.handleBrushResize.bind(this)} brushSize={this.state.brushSize} brushColor={this.state.brushColor} type="range" min="0" max="60"/>
                                    </Grid>
                                    </div>
                                : <div></div>
                            }

                        </div>
                        : <div id="capture-canvas">
                            <canvas id="canvas" style={{backgroundColor:"white"}}  width="1100" height="450" ref={this.display}/>
                            <Grid item>
                                <Typography align={'center'}  component={'div'}> {/* component={'span'} cz error <div> cannot appear as a descendant of <p>.*/}
                                    Prompt:
                                    <Box fontWeight="fontWeightBold" m={1} display={"inline"}>{this.props.currentQuestion}</Box>
                                </Typography>
                            </Grid>
                            </div>
                    }
                    
                    
                </Grid>
                {this.props.user == this.props.hostname && this.props.discussion && (this.props.round<this.props.maxRounds)? 
                    <div>
                        <button type="button" onClick={this.handleEndDiscussionButton.bind(this)}>Next Question</button>
                    </div> : 
                    <div></div>
                    }
                    <br/>    
                    {this.props.user == this.props.hostname? 
                    <div>
                        <button type="button" onClick={this.handleEndGame.bind(this)}>End Game</button>
                    </div> : 
                    <div></div>
                    }
            </div>
        )

    }
}

export default DrawingApp;