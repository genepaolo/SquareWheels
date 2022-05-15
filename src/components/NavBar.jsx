import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../styles/styles.css";
import { Navbar, Nav } from 'react-bootstrap';

class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            active: 'Home',
            loggedIn: false,
            name:'',
            email:'',
            googleId:'',
            givenName:'',
            familyName:'',
            redirect:'' };
    }

    onClick = (newActive) => {
        console.log("NEW ACTIVE: " + newActive);
        this.setState({
            active: newActive,
        });

    };

    setLoginValues(response){
        this.setState({
            loggedIn: true
        });
        
      }

    logout(){
        this.setState({
            loggedIn: false
        });
    }

    handleClick = (e) => {
        e.preventDefault();
        localStorage.setItem('email',"");
        localStorage.setItem("familyName","");
        localStorage.setItem("givenName","");
        localStorage.setItem("googleID","");
        alert('Logged out');
    };

    render() {
        if(localStorage.getItem("email")==""){
            return (
                <Navbar class="navbar ms-auto" bg="light" expand="lg">
                <Navbar.Brand href="/">SquareWheels</Navbar.Brand>
                    {/* <Navbar.Collapse id="basic-navbar-nav"> */}
                    <Nav class="links">
                    <Nav.Link class="nav-link" href="/">Home</Nav.Link>
                    <Nav.Link class="nav-link" href="/LoginWithGoogle">LoginWithGoogle</Nav.Link>
                    <Nav.Link class="nav-link" href="/results">Results</Nav.Link>
                    </Nav>
                {/* </Navbar.Collapse> */}
                <div className='navbar-wrapper'></div>
                    {/* <div className='navbar-wrapper'>
                    <div className='navbar-div'> */}
                        {/* <Link to="/">
                            <div className='navbar-items'
                                    onClick={() => {
                                        { this.onClick('Home') }
                                    }}>
                                    Home
                                </div>
                        </Link> */}
                        {/* <Link to="/play">
                            <div className='navbar-items'
                                    onClick={() => {
                                        { this.onClick('Play') }
                                    }}>
                                    Play
                                </div>
                        </Link>
                        <Link to="/login">
                            <div className='navbar-items'
                                    onClick={() => {
                                        { this.onClick('Login') }
                                    }}>
                                    Login
                                </div>
                        </Link> */}
                        {/* <Link to="/LoginWithGoogle">
                            <div className='navbar-items'
                                    onClick={() => {
                                        { this.onClick('LoginWithGoogle') }
                                    }}>
                                    LoginWithGoogle
                                </div>
                        </Link> */}
                    {/* </div >
                </div > */}
                </Navbar>
            );
        }
        else{
            return (
                <Navbar class="navbar ms-auto" bg="light" expand="lg">
                <Navbar.Brand href="/">SquareWheels</Navbar.Brand>
                    {/* <Navbar.Collapse id="basic-navbar-nav"> */}
                    <Nav class="links">
                    <Nav.Link class="nav-link" href="/">Home</Nav.Link>
                    <Nav.Link class="nav-link" href="/play">Play</Nav.Link>
                    <Nav.Link class="nav-link" href="/LogoutWithGoogle">LogOutGoogle</Nav.Link>
                    <Nav.Link class="nav-link" href="/results">Results</Nav.Link>
                    </Nav>
                {/* </Navbar.Collapse> */}
                <div className='navbar-wrapper'></div>
                    {/* <div className='navbar-wrapper'>
                    <div className='navbar-div'> */}
                        {/* <Link to="/">
                            <div className='navbar-items'
                                    onClick={() => {
                                        { this.onClick('Home') }
                                    }}>
                                    Home
                                </div>
                        </Link> */}
                        {/* <Link to="/play">
                            <div className='navbar-items'
                                    onClick={() => {
                                        { this.onClick('Play') }
                                    }}>
                                    Play
                                </div>
                        </Link>
                        <Link to="/login">
                            <div className='navbar-items'
                                    onClick={() => {
                                        { this.onClick('Login') }
                                    }}>
                                    Login
                                </div>
                        </Link> */}
                        {/* <Link to="/LoginWithGoogle">
                            <div className='navbar-items'
                                    onClick={() => {
                                        { this.onClick('LoginWithGoogle') }
                                    }}>
                                    LoginWithGoogle
                                </div>
                        </Link> */}
                    {/* </div >
                </div > */}
                </Navbar>
            );
        }
        
    }
}

export default NavBar;