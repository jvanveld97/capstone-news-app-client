import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import { SearchQueryContext } from '../pages/SearchQueryContext';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
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
    width: '100%',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }))

export const NavBar = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const { setSearchQuery } = useContext(SearchQueryContext)
    const [currentQuery, setCurrentQuery] = useState('')

    const handleSearchChange = (event) => {
      setCurrentQuery(event.target.value)
    }
    const handleSearchSubmit = (query) => {
      if (query.trim() !== '') {
        setSearchQuery(query.trim());
        setCurrentQuery('');
      }
    }

    const handleCategoryClick = (category) => {
      setSearchQuery(''); // Clear the search query when a category is clicked
      navigate(`/${category}`);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit(event.target.value.trim());
            event.target.value = ''; // Clear the input field after submitting
            setCurrentQuery('')
          }
        }
  
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const handleLogout = () => {
      localStorage.removeItem("news_token");
      navigate('/login');
      handleMenuClose();
    };
  
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        {localStorage.getItem("news_token") !== null ? (
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        ) : (
          <>
            <MenuItem component={NavLink} to="/login" onClick={handleMenuClose}>
              Login
            </MenuItem>
            <MenuItem component={NavLink} to="/register" onClick={handleMenuClose}>
              Register
            </MenuItem>
          </>
        )}
      </Menu>
    );
  
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              className="navbar__links"
            >
              <NavLink to="/" style={{ color: 'inherit', textDecoration: 'none', padding: "10px" }} onClick={() => handleCategoryClick('')}>
                Top News
              </NavLink>
              <NavLink to="/entertainment" style={{ color: 'inherit', textDecoration: 'none' , padding: "10px"}} onClick={() => handleCategoryClick('entertainment')}>
                Entertainment
              </NavLink>
              <NavLink to="/technology" style={{ color: 'inherit', textDecoration: 'none' , padding: "10px"}} onClick={() => handleCategoryClick('technology')}>
                Technology
              </NavLink>
              <NavLink to="/sports" style={{ color: 'inherit', textDecoration: 'none' , padding: "10px"}} onClick={() => handleCategoryClick('sports')}>
              Sports
              </NavLink>
              <NavLink to="/science" style={{ color: 'inherit', textDecoration: 'none' , padding: "10px"}} onClick={() => handleCategoryClick('science')}>
              Science
              </NavLink>
              <NavLink to="/saved_articles" style={{ color: 'inherit', textDecoration: "underline" , padding: "10px"}} className="navbar__right-links">
              Saved
              </NavLink>
              <NavLink to="/topics/articles" style={{ color: 'inherit', textDecoration: "underline" , padding: "10px"}} className="navbar__right-links">
              Following
              </NavLink>
            </Typography>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    value={currentQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                />
            </Search>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </Box>
    );
  };