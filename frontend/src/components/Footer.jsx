import React from 'react'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

// const theme = createTheme({
//     components: {
//        MuiTypography: {
//          styleOverrides: {
//            h1: {
//              '&.MuiTypography-gutterBottom': {
//                marginBottom: 32
//              }
//            },
//            gutterBottom: {
//              marginBottom: 8 //default e.g. body1/paragraphs
//            }
//          }
//        }
//      }
//    })

export default function BasicGrid() {
    return (
        <Box backgroundColor='#222935' color='white' py={10}>
            <Container>
                <Grid container columnSpacing={8}>
                    <Grid item xs={4}>
                        <Typography variant='h4' gutterBottom>LOGO</Typography>
                        <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor libero id et, in gravida. Sit diam duis mauris nulla cursus. Erat et lectus vel ut sollicitudin elit at amet.</Typography>
                    </Grid>
                    <Grid item xs={8} columnSpacing={2} container>
                        <Grid item xs={4}>
                            <Typography variant='h6'>About Us</Typography>
                            <List>
                                <ListItem disablePadding> <ListItemText primary="Careers" /> </ListItem>
                                <ListItem disablePadding> <ListItemText primary="Our Stores" /> </ListItem>
                                <ListItem disablePadding> <ListItemText primary="Our Cares" /> </ListItem>
                                <ListItem disablePadding> <ListItemText primary="Terms & Conditions" /> </ListItem>
                                <ListItem disablePadding> <ListItemText primary="Privacy Policy" /> </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant='h6'>Customer Care</Typography>
                            <List>
                                <ListItem disablePadding> <ListItemText primary="Help Center" /> </ListItem>
                                <ListItem disablePadding> <ListItemText primary="How to Buy" /> </ListItem>
                                <ListItem disablePadding> <ListItemText primary="Track Your Order" /> </ListItem>
                                <ListItem disablePadding> <ListItemText primary="Corporate & Bulk Purchasing" /> </ListItem>
                                <ListItem disablePadding> <ListItemText primary="Returns & Refunds" /> </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant='h6'>Contact Us</Typography>
                            <List>
                                <ListItem disablePadding> <ListItemText primary="70 Washington Square South, New York, NY 10012, United States" /> </ListItem>
                                <ListItem disablePadding> <ListItemText primary="Email: uilib.help@gmail.com" /> </ListItem>
                                <ListItem disablePadding> <ListItemText primary="Phone: +1 1123 456 780" /> </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
