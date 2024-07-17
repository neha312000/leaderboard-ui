import React from 'react';
import { Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

// Create styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    backgroundColor: '#333'
}));

const StyledTypography = styled(Typography)({
    flexGrow: 1,
    textAlign: 'center'
});

const AppHeader = ({ title }) => {
    return (
        <StyledAppBar position="static">
            <Toolbar>
                <StyledTypography variant="h4">
                    {title}
                </StyledTypography>
            </Toolbar>
        </StyledAppBar>
    );
};

export default AppHeader;
