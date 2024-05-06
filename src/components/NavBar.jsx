// import { NavLink, useNavigate } from "react-router-dom"
// import "./NavBar.css"

// export const NavBar = () => {
//     const navigate = useNavigate()
//     return (
//         <ul className="navbar pb-10">
//             <li className="navbar__item pl-10">
//                 <NavLink className="text-left underline text-blue-600 hover:text-purple-700" to={"/"}>News</NavLink>
//             </li>
//             {
//                 (localStorage.getItem("news_token") !== null) ?
//                     <li className="navbar__item">
//                         <button className="underline text-blue-600 hover:text-purple-700"
//                             onClick={() => {
//                                 localStorage.removeItem("news_token")
//                                 navigate('/login')
//                             }}
//                         >Logout</button>
//                     </li> :
//                     <>
//                         <li className="navbar__item">
//                             <NavLink className="text-left underline text-blue-600 hover:text-purple-700" to={"/login"}>Login</NavLink>
//                         </li>
//                         <li className="navbar__item">
//                             <NavLink className="text-left underline text-blue-600 hover:text-purple-700" to={"/register"}>Register</NavLink>
//                         </li>
//                     </>
//             }        </ul>
//     )
// }

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
import { Button } from '@mui/material' 

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
        if (query !== '') {
          setSearchQuery(query);
        }
      }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchSubmit(event.target.value.trim());
            event.target.value = ''; // Clear the input field after submitting
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
            >
              <NavLink to="/" style={{ color: 'inherit', textDecoration: 'none', padding: "10px" }}>
                Top News
              </NavLink>
              <NavLink to="/entertainment" style={{ color: 'inherit', textDecoration: 'none' , padding: "10px"}}>
                Entertainment
              </NavLink>
              <NavLink to="/technology" style={{ color: 'inherit', textDecoration: 'none' , padding: "10px"}}>
                Technology
              </NavLink>
              <NavLink to="/sports" style={{ color: 'inherit', textDecoration: 'none' , padding: "10px"}}>
              Sports
              </NavLink>
              <NavLink to="/science" style={{ color: 'inherit', textDecoration: 'none' , padding: "10px"}}>
              Science
              </NavLink>
              <NavLink to="/saved_articles" style={{ color: 'inherit', textDecoration: "underline" , padding: "10px"}}>
              Saved
              </NavLink>
              <NavLink to="/topics/articles" style={{ color: 'inherit', textDecoration: "underline" , padding: "10px"}}>
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