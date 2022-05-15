import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Play from '../pages/Play';
import Home from '../pages/Home';
import Results from '../pages/Results';
import Lobby from './Host/Lobby/Lobby';
import LoginWithGoogle from '../pages/LoginWithGoogle'
import LogoutWithGoogle from '../pages/LogoutWithGoogle'
import Instructions from './Player/Instructions/Instructions';
import Navbar from './NavBar';
import Start from './Host/Start/Start';
import Room1 from '../pages/gameroom1/Room1'

const Main = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Switch> {/* The Switch decides which component to show based on the current URL.*/}
                <Route exact path='/' component={Home} ></Route>
                <Route exact path='/login' component={Login} ></Route>
                <Route exact path='/profile' component={Profile} ></Route>
                <Route exact path='/play' component={Play} ></Route>
                <Route exact path='/LoginWithGoogle' component={LoginWithGoogle} ></Route>
                <Route exact path='/LogoutWithGoogle' component={LogoutWithGoogle} ></Route>
                <Route exact path='/lobby' component={Lobby} ></Route>
                <Route exact path='/instructions' component={Instructions} ></Route>
                <Route exact path='/start' component={Start} ></Route>
                <Route exact path='/room' component={Room1} ></Route>
                <Route exact path='/results' component={Results} ></Route>
            </Switch>
        </div>
    );
}

export default Main;
