import React, { Component, useState } from "react";
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import "../styles/styles.css";
import 'bootstrap/dist/css/bootstrap.css';
import { Redirect } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
var qs = require('qs');
var reloadcount=0;

class LogoutWithGoogle extends Component {
    static propTypes = {
    };

    constructor(props) {
        super(props);
        this.state = {
            active: 'Login',
            showModal: false,
            loggedIn: false,
            loading: false,
            error: null,
            recoverPasswordSuccess: null,
            name:'',
            email:'',
            googleId:'',
            givenName:'',
            familyName:'',
            redirect:''
          };
    }

    onClick = (newActive) => {
        console.log(newActive);
        this.setState({
            active: newActive,
        });
    };

    render() {
        const clientId = '707299127538-8ea3vna5h3l8vvgqp6rsgn191iea01ho.apps.googleusercontent.com';
        /*res.profileObj is storing the user's information if the log in is successful*/
        const onSuccess = (res)=>{
            console.log('Log in successful with : ', res.profileObj);

            let databody = {
                "email": res.profileObj.email,
                "familyName": res.profileObj.familyName,
                "givenName":res.profileObj.givenName,
                "googleID":res.profileObj.googleId
            }

            localStorage.setItem('email', res.profileObj.email);
            localStorage.setItem("familyName",res.profileObj.familyName);
            localStorage.setItem("givenName",res.profileObj.givenName);
            localStorage.setItem("googleID",res.profileObj.googleId);
        
            return fetch('http://localhost:3001/addNewUser', {
                method: 'POST',
                body: JSON.stringify(databody),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(res => res.json())
            .then(data => console.log(data))
            .then(this.setState({
                redirect:"/play", 
                email:res.profileObj.email,
                familyName:res.profileObj.familyName,
                givenName:res.profileObj.givenName,
                googleID:res.profileObj.googleId,
                state:{
                    email:res.profileObj.email,
                    familyName:res.profileObj.familyName,
                    givenName:res.profileObj.givenName,
                    googleID:res.profileObj.googleId
                }}));
        
        };

        const onLogoutSuccess = () =>{
            alert('successfully logged out');
        }

        const onFaliure = (res)=>{
            console.log('Login failed with: ', res);
        };

        localStorage.setItem('email', "");
        localStorage.setItem("familyName","");
        localStorage.setItem("givenName","");
        localStorage.setItem("googleID","");
        if(localStorage.getItem('email')==""){
            reloadcount+=1;
            if(reloadcount<2){
                //window.location.reload(false);
            }
            return <Redirect to={{
                pathname: '/'
            }} />
        }
        return (
            // return a log in button
            // if the log in is successful, the user's information will be logged to the console8'
            <div className='sw-body' style={{position:"fixed",top:200}}>
                Logging out
            </div>
        );
        
    }
}

export default LogoutWithGoogle;