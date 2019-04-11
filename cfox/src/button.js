import React from 'react';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';


const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
});

const PlayButton = (props) => {
    return (
        <MuiThemeProvider theme={theme}>
        <Button onClick={props.onClick} variant="contained" color="primary">
        {props.value}
        </Button>
        </MuiThemeProvider>
    );
};

export default PlayButton;
