import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

function TextFieldx({ children, ...other }) {
    return (
        <TextField
            variant="outlined"
            sx={{
                mb: 2,
                '& .Mui-focused.MuiFormLabel-root': {
                    color: 'text.secondary',
                },
                '& .MuiFormLabel-filled.MuiFormLabel-root': {
                    display: 'none',
                }
            }}
            InputLabelProps={{ shrink: false }}
            {...other}
        >
            {children}
        </TextField>
    );
}

export default function SignUp({ setTrigger, userCreatedSnackbar }) {

    const navigate = useNavigate();

    async function loginUser() {
        const loginDetails = {
            email: signUpInfo.email,
            password: signUpInfo.password,
        };

        axios.post('http://localhost:4000/user/login', loginDetails, { withCredentials: true })
            .then(() => {
                setTrigger(prevValue => !prevValue)
                navigate('/');
            })
            .catch((error) => console.log(error));
    }

    const [signUpInfo, setSignUpInfo] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const handleChange = (event) => {
        setSignUpInfo({ ...signUpInfo, [event.target.name]: event.target.value });
    };

    async function createUser(e) {
        e.preventDefault();

        const userDetails = {
            firstName: signUpInfo.firstName,
            lastName: signUpInfo.lastName,
            username: signUpInfo.username,
            email: signUpInfo.email,
            password: signUpInfo.password,
            phoneNumber: signUpInfo.phoneNumber
        };

        axios.post('http://localhost:4000/customer/signup', userDetails, { withCredentials: true })
            .then((response) => {
                if (response) {
                    userCreatedSnackbar(true);
                    loginUser();
                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <Container sx={{ mt: 8, mb: 5 }}>
            <Card sx={{ width: 500, mx: 'auto' }}>
                <CardContent sx={{ p: 5 }} component='form' onSubmit={createUser}>
                    <Stack>
                        <Typography align='center' variant='h4' mt={2} gutterBottom>LOGO</Typography>
                        <Typography align='center' variant='h6' mb={5}>Create Your Account</Typography>
                        <Typography variant='subtitle2' gutterBottom>First Name</Typography>
                        <TextFieldx
                            value={signUpInfo.firstName}
                            onChange={handleChange}
                            name='firstName'
                            label="Enter your First Name"
                        />
                        <Typography variant='subtitle2' gutterBottom>Last Name</Typography>
                        <TextFieldx
                            value={signUpInfo.lastName}
                            onChange={handleChange}
                            name='lastName'
                            label="Enter your Last Name"
                        />
                        <Typography variant='subtitle2' gutterBottom>Username</Typography>
                        <TextFieldx
                            value={signUpInfo.username}
                            onChange={handleChange}
                            name='username'
                            label="Enter a Username"
                        />
                        <Typography variant='subtitle2' gutterBottom>Email</Typography>
                        <TextFieldx
                            value={signUpInfo.email}
                            onChange={handleChange}
                            name='email'
                            type='email'
                            label="example@mail.com"
                        />
                        <Typography variant='subtitle2' gutterBottom>Password</Typography>
                        <TextFieldx
                            value={signUpInfo.password}
                            onChange={handleChange}
                            name='password'
                            type='password'
                            label="*********"
                        />
                        <Typography variant='subtitle2' gutterBottom>Phone Number</Typography>
                        <TextFieldx
                            value={signUpInfo.phoneNumber}
                            onChange={handleChange}
                            name='phoneNumber'
                            label="Enter your Phone Number"
                        />
                        <Button variant='contained' size='large' type='submit' sx={{ mt: 5, mb: 3 }}>Submit</Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    )
}
