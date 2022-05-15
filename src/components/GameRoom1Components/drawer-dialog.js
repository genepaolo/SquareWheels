import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { socket } from '../Global/Global';
export default function DrawerDialog(props) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    React.useEffect(()=>{
        if (props.time_is_up && !props.game_ended){
            console.log(props.game_ended);
            setOpen(true)
        }
        return ()=> {
            setOpen(false)
        }
    },[props.time_is_up]);

    const handleClose = (question) => {
        socket.emit("updateDrawnQuestion",props.pin,question)
        setOpen(false);
    };
    const handleClick = question => {
        handleClose(question)
    }
    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" style={{paddingBottom:'0',alignSelf:'center'}}>{"Choose a word :"}</DialogTitle>
                <DialogActions >
                    {props.four_questions.map(question=>
                        <Button key={question} onClick={()=>handleClick(question)} color="primary" style={{paddingLeft:'30px',paddingRight:'30px',fontFamily:'Roboto',fontSize:'20px'}}>
                            {question}
                        </Button>
                    )}
                </DialogActions>

            </Dialog>
        </div>
    );
}