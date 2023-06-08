import { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; 

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
            <DialogTitle>Sign In</DialogTitle>
            <form onSubmit={submitUser}>
                <DialogContent>
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
                    <Typography mt={3} variant="subtitle2">
                        {'New User? '}
                        <Link component={RouterLink} to='/user/signup' onClick={() => props.handleClose}>
                            Create an Account
                        </Link>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>Cancel</Button>
                    <Button type='submit' onClick={props.handleClose}>Login</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}