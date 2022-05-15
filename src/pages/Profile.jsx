import React, { Component} from "react";
import "../styles/styles.css";
import 'bootstrap/dist/css/bootstrap.css';
// var qs = require('qs');
class Profile extends Component {
    static propTypes = {
        // make prop for function that populates div, passed in by main
        // buttonLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
        // active: PropTypes.string.isRequired,
        // onClick: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            active: 'Profile',
            showModal: false,
            loggedIn: false,
            loading: false,
            error: null,
            recoverPasswordSuccess: null,
            name:'',
            email:'',
            googleId:'',
          };
        
    }

    onClick = (newActive) => {
        console.log(newActive);
        this.setState({
            active: newActive,
        });
    };

    render() {
        return (

            <div className='sw-body'>
                <div className='profile-body'>
                    Profile
                </div>
            </div>
        );
    }
}

export default Profile;