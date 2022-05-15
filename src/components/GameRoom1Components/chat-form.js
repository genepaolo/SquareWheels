import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { socket } from '../../components/Global/Global';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        // justifyContent:'flex-start',
        alignContent:'stretch',
        alignItems:'stretch',
        // flexWrap: 'wrap',
        // backgroundColor:'white'
    },
    textField: {
        backgroundColor:'white',
        margin:0
    },
}));

export default function ChatForm(props) {
    const classes = useStyles();
    const [message, setMessage] = React.useState('');

    React.useEffect(()=>{
        console.log("question",props.currentQuestion)
    },[props.currentQuestion])
    const handleChange =  event => {
        setMessage(event.target.value);
    };
    const handleSubmit =  e => {
        e.preventDefault();
        socket.emit('chatter',props.pin,props.user,message);
        setMessage("");
        
    };
    return (
        <form className={classes.container} onSubmit={handleSubmit} >
            <TextField
                fullWidth
                margin="dense"
                variant="outlined"
                placeholder="Help the current player"
                className={classes.textField}
                value={message}
                onChange={handleChange}
            />
        </form>
    )
}