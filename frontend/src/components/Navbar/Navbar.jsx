import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Cart from './Cart';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const categories = [
    {
        name: 'Mobiles, Tablets & More',
        link: 'Mobiles,%20Tablets%20&%20More'
    },
    {
        name: 'Computers & Accessories',
        link: 'Computers%20&%20More'
    },
    {
        name: 'Appliances',
        link: 'Appliances'
    },
    {
        name: 'Electronics',
        link: 'Electronics'
    },
    {
        name: 'Fashion',
        link: 'Fashion'
    },
    {
        name: 'Home & Kitchen',
        link: 'Home%20&%20Kitchen'
    },
    {
        name: 'Beauty & Health',
        link: 'Beauty%20&%20Health'
    },
]

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function NavBar({
    user,
    setTrigger,
    loginDialog,
    setLoginDialog,
    updateInCart,
    removeFromCart,
    setUserTab
}) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [search, setSearch] = useState('');

    function signOut() {
        axios.get(`http://localhost:4000/user/logout`, { withCredentials: true })
            .then(() => setTrigger(prevValue => !prevValue))
            .catch((err) => console.log(err));
    }

    const [cartDrawer, setCartDrawer] = useState(false);

    return (
        <AppBar position="fixed">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* ----------------------------- Mobile view ----------------------------- */}
                    <Box sx={{ 
                        flex: '1 1 0', 
                        width: 0,
                        display: { xs: 'flex', md: 'none' }
                    }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem onClick={handleCloseNavMenu}>
                                {/* yet to implement */}
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Box sx={{ 
                        flex: '2 1 0', 
                        width: 0,
                        display: { xs: 'flex', md: 'none' }
                    }}>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LOGO
                        </Typography>
                    </Box>
                    {/* ----------------------------- Desktop view ----------------------------- */}
                    <Box sx={{ 
                        flex: '1 1 0', 
                        width: 0,
                        display: { xs: 'none', md: 'flex' }
                    }}>
                        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            LOGO
                        </Typography>
                        <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{ color: 'white' }}
                        >
                            Categories
                        </Button>
                    </Box>
                    <Box sx={{ 
                        flex: '2 1 0', 
                        width: 0,
                        display: { xs: 'none', md: 'flex' }
                    }}>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuList>
                                {categories.map(category => (
                                    <MenuItem
                                        component={Link}
                                        onClick={handleClose}
                                        to={`/products/category/${category.link}`}
                                        key={category.name}
                                    >
                                        <ListItemText>{category.name}</ListItemText>
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                        <Search sx={{
                            flexGrow: 1,
                        }}>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                sx={{
                                    '& .MuiInputBase-input': {
                                        width: '20rem'
                                    }
                                }}
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                        <Button component={Link} to={`/products/search/${search}`} variant='contained' color='info'>
                            <SearchIcon />
                        </Button>
                    </Box>
                    {/* ----------------------------- Universal view ----------------------------- */}
                    <Box sx={{ 
                        flex: '1 1 0', 
                        width: 0,
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                        {user
                            ?
                            <>
                                <Button onClick={() => setCartDrawer(true)}>
                                    <Badge badgeContent={user.cartItems} color="secondary">
                                        <ShoppingCartOutlinedIcon sx={{ color: 'white' }} />
                                    </Badge>
                                </Button>
                                <Cart
                                    user={user}
                                    cartDrawer={cartDrawer}
                                    setCartDrawer={setCartDrawer}
                                    updateInCart={updateInCart}
                                    removeFromCart={removeFromCart}
                                />
                                <Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt="Remy Sharp" src={user.userImage} />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        PaperProps={{ style: { width: 200 } }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                        onClick={handleCloseUserMenu}
                                    >
                                        <MenuItem component={Link} to='/user' onClick={() => setUserTab(0)} key="Profile">
                                            <Typography textAlign="center">Profile</Typography>
                                        </MenuItem>
                                        <MenuItem component={Link} to='/user' onClick={() => setUserTab(2)} key="Orders">
                                            <Typography textAlign="center">Orders</Typography>
                                        </MenuItem>
                                        <MenuItem key="Sign Out" onClick={signOut}>
                                            <Typography textAlign="center">Sign Out</Typography>
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            </>
                            :
                            <>
                                <Button sx={{ color: 'white' }} onClick={() => setLoginDialog(true)}>
                                    Sign in
                                </Button>
                                <Login
                                    setTrigger={setTrigger}
                                    loginDialog={loginDialog}
                                    handleClose={() => setLoginDialog(false)}
                                />
                            </>
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
