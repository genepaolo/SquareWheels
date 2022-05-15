import React from 'react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { socket } from './Global/Global';


export default function SupervisorList(props) {
    const handleLink = (file) =>{
        var win = window.open();
        win.document.write('<iframe src="' + file + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;"></iframe>');
    }
    const handleDelete= (pin) =>{
        console.log(pin);
    }
    const generate_games=(games)=>{
        return (
            <div >
                <Paper>
                    <Table size="small">
                        <TableHead>
                            {/* <TableRow>
                                <TableCell>Submissions</TableCell>
                            </TableRow> */}
                            <TableCell>Submissions</TableCell>
                        </TableHead>
                        <TableBody>
                            {games.filter(game=>game!=null && game.file!=null).map(game => (
                                <TableRow key={game._id}>
                                    <TableCell component="th" scope="row">
                                        {game.group+"  "}
                                        
                                    </TableCell>
                                    <TableCell align="right">
                                        <button onClick={() => handleLink(game.file)}>Group Image</button>
                                        {/* {game.pin+"  "} */}
                                    </TableCell>
                                    {/* <TableCell align="right">
                                        <button onClick={() => handleDelete(game.pin)}>Delete</button>
                                    </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
    // const sortgames= games=>{
    //     games.sort((a, b) => (a.score < b.score || (a.score===b.score && a.nickname > b.nickname)) ? 1 : -1)
    //     return games
    // }
    if(props.games.length>0){
        console.log(props.games);
    }
    return (
        <div >

            <Grid container spacing={12}>
                <Grid item key={"space"} xs={4}></Grid>
                {props.games.length>0 ? <Grid item key={"games"} xs={4}>
                        {/* {generate_games(sortgames(props.games))} */}
                        {generate_games(props.games)}
                </Grid> : <div></div>}
                <Grid item key={"space"} xs={4}></Grid>
                

            </Grid>

        </div>
    );
}