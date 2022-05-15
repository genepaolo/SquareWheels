import React, { Component} from "react";
import SupervisorList from "../components/SupervisorList"
import "../styles/styles.css";
import 'bootstrap/dist/css/bootstrap.css';
// var qs = require('qs');
class Results extends Component {
    static propTypes = {
        // make prop for function that populates div, passed in by main
        // buttonLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
        // active: PropTypes.string.isRequired,
        // onClick: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            active: 'Results',
            showModal: false,
            loggedIn: false,
            loading: false,
            error: null,
            recoverPasswordSuccess: null,
            email:'',
            googleId:null,
            givenName:'',
            familyName:'',
            games:[]
          };
        
    }

    componentDidMount(){
        console.log(localStorage.getItem('googleID'));
        if(localStorage.getItem('googleID')){
            this.setState({
                email:localStorage.getItem('email'),
                googleId:localStorage.getItem('googleId'),
                givenName:localStorage.getItem('givenName'),
                familyName:localStorage.getItem('familyName'),
            })
            fetch('http://localhost:3001/supervisor/email/'+ localStorage.getItem('email'), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(res => res.json())
            .catch(error => console.log(error))
            .then(
                // data => console.log(data)
                data => 
                {
                    if(data && data.games){
                        this.setState({games:data.games})
                    }
                }
            )

            // fetch('http://localhost:3001/supervisor', {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            // })
            // .then(res => res.json())
            // .catch(error => console.log(error))
            // .then(data => console.log(data))
        }
    }
    
    onClick = (newActive) => {
        console.log(newActive);
        this.setState({
            active: newActive,
        });
    };

    render() {
        if(localStorage.getItem('googleID')==""){
            localStorage.setItem('googleID', "temp");
            window.location.reload(false);
            // window.location.reload(true);
        }
        let list =this.state.games.length>0 ? <SupervisorList games={this.state.games}/> : <div>Empty List</div>;
        return (
            <div className='sw-body'>
                <div id="results-body" class="results">
                    Results
                    {localStorage.getItem('googleID') ? 
                    <div>
                        <div> {list} </div>
                    </div>: <div>Must login to see results</div>
                    }
                </div>
                
                
                
            </div>
        );
    }
}

export default Results;