import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

export default function Login(props) {

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        setLoginInfo({ ...loginInfo, [event.target.name]: event.target.value });
    };


    async function submitUser(e) {
        e.preventDefault();

        const loginDetails = {
           email: loginInfo.email,
           password: loginInfo.password,
        };
 
        axios.post('http://localhost:4000/user/login', loginDetails, { withCredentials: true })
            .then(() => props.setTrigger(prevValue => !prevValue))
            .catch((error) => console.log(error));
    }

    return (
        <Dialog open={props.loginDialog} onClose={props.handleClose}>
            <DialogTitle></DialogTitle>
            <form onSubmit={submitUser}>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <TextField
                        value={loginInfo.email}
                        onChange={handleChange}
                        autoFocus
                        margin="dense"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        value={loginInfo.password}
                        onChange={handleChange}
                        autoFocus
                        margin="dense"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Cancel</Button>
                    <Button type='submit' onClick={props.handleClose}>Login</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}