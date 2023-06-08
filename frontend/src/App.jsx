import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState, useEffect, forwardRef } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom'
import axios from 'axios';
import Navbar from './components/Navbar/Navbar';
import ProductList from './components/Product/ProductList';
import Home from './components/Home';
import Product from './components/Product/Product';
import User from './components/User/User'
import Order from './components/User/Order';
import Container from '@mui/material/Container';
import SignUp from './components/User/SignUp';
import Footer from './components/Footer';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function App() {

    // -------------------------------- User --------------------------------

    const [user, setUser] = useState(null);
    const [updateTrigger, setTrigger] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:4000/user`, { withCredentials: true })
            .then((response) => {
                if (response) setUser(response.data)
                else setUser(null);
            })
            .catch((err) => console.log(err));
    }, [updateTrigger]);

    const [loginDialog, setLoginDialog] = useState(false);
    const [userTab, setUserTab] = useState(0);
    const [profSec, setProfSec] = useState(true);
    const [addressSec, setAddressSec] = useState('view');

    // -------------------------------- Cart --------------------------------

    async function updateInCart(productId, quantity) {
        axios.put(`http://localhost:4000/customer/${user._id}/cart/${productId}`,
            { quantity: quantity },
            { withCredentials: true })
            .then((response) => {
                if (response) setTrigger(prevValue => !prevValue)
            })
            .catch((error) => console.log(error));
    }

    async function removeFromCart(productId) {
        axios.delete(`http://localhost:4000/customer/${user._id}/cart/${productId}`, { withCredentials: true })
            .then((response) => {
                if (response) setTrigger(prevValue => !prevValue)
            })
            .catch((error) => console.log(error));
    }

    // -------------------------------- Snackbar --------------------------------

    const [snackbar, setSnackbar] = useState({
        content: '',
        severity: '',
        open: false,
        vertical: 'bottom',
        horizontal: 'right',
    });
    const { vertical, horizontal, open, content, severity } = snackbar;

    const openSnackbar = (content, severity) => {
        setSnackbar({ ...snackbar, open: true, content: content, severity: severity });
    };

    const closeSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // ----------------------------------------------------------------

    return (
        <>
            <Routes>
                <Route path='/' element={
                    <>
                        <Navbar
                            user={user}
                            setTrigger={setTrigger}
                            loginDialog={loginDialog}
                            setLoginDialog={setLoginDialog}
                            updateInCart={updateInCart}
                            removeFromCart={removeFromCart}
                            setUserTab={setUserTab}
                        />
                        <Container sx={{ mt: 8, mb: 8 }}>
                            <Outlet />
                        </Container>
                        <Footer />
                    </>
                }>
                    <Route path='' element={<Home />} />
                    <Route path='products/category/:category' element={
                        <ProductList updateTrigger={updateTrigger} />}
                    />
                    <Route path='products/search/:search' element={
                        <ProductList updateTrigger={updateTrigger} />}
                    />
                    <Route path='product/:id' element={
                        <Product
                            user={user}
                            updateTrigger={updateTrigger}
                            setTrigger={setTrigger}
                            setLoginDialog={setLoginDialog}
                            updateInCart={updateInCart}
                        />}
                    />
                    <Route path='user' element={
                        <User
                            setTrigger={setTrigger}
                            user={user}
                            profSec={profSec}
                            setProfSec={setProfSec}
                            addressSec={addressSec}
                            setAddressSec={setAddressSec}
                            userTab={userTab}
                            setUserTab={setUserTab}
                            openSnackbar={openSnackbar}
                        />}
                    />
                    <Route path='order/:orderId' element={<Order user={user} />} />
                </Route>
                <Route path='/user/signup' element={
                    <SignUp setTrigger={setTrigger} />}
                />
            </Routes>
            <Snackbar
                anchorOrigin={{
                    vertical,
                    horizontal
                }}
                open={open}
                autoHideDuration={3000}
                onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity={severity} sx={{ width: '100%' }}>
                    {content}
                </Alert>
            </Snackbar>
        </>
    );
}