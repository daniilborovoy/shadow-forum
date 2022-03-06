import React, { FC, useState, MouseEvent } from 'react';
import { authApi } from '../../services/auth.service';
import { useAppSelector } from '../../hooks/redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge, MenuItem,
  Menu,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { getUser } from '../../store/selectors/authSelectors';
import {
  CreateDiscussionFormDialog,
} from '../forms/create-discussion-form-dialog/CreateDiscussionFormDialog';

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

const Header: FC = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);

  const [logout, {
    isLoading: logoutLoading,
    error: logoutError,
  }] = authApi.useLogoutMutation();

  const user = useAppSelector(getUser);

  const isMenuOpen = Boolean(anchorEl);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const logoutHandler = async (): Promise<void> => {
    await logout();
  };

  const openProfileMenuHandler = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const openMobileMenuHandler = (event: MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const closeMobileMenuHandler = () => {
    setMobileMoreAnchorEl(null);
  };

  const closeMenuHandler = () => {
    setAnchorEl(null);
    closeMobileMenuHandler();
  };

  const menuId = 'shadow-forum-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={closeMenuHandler}
    >
      {user &&
        (
          [
            <MenuItem key={1} onClick={() => {
              closeMenuHandler();
              navigate('/account');
            }}>Мой аккаунт</MenuItem>,
            <MenuItem key={321}
            >Мои обсуждения</MenuItem>,
            <MenuItem key={2} onClick={async () => {
              closeMenuHandler();
              await logoutHandler();
            }}>Выйти из аккаунта</MenuItem>,
          ]
        )
      }
      {!user && (<Link to='authorize' style={{
        textDecoration: 'none',
        color: '#000',
      }} onClick={closeMenuHandler}><MenuItem>Войти</MenuItem></Link>)}
    </Menu>
  );

  const mobileMenuId = 'shadow-forum-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={closeMobileMenuHandler}
    >
      <MenuItem>
        <IconButton size='large' aria-label='show 4 new mails' color='inherit'>
          <Badge badgeContent={4} color='error'>
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Сообщения</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size='large'
          aria-label='show 17 new notifications'
          color='inherit'
        >
          <Badge badgeContent={17} color='error'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Уведомления</p>
      </MenuItem>
      <MenuItem onClick={openProfileMenuHandler}>
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>Профиль</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed'>
        <Toolbar>
          <Typography
            variant='h6'
            noWrap
            component='div'
            onClick={() => navigate('/')}
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
              },
              cursor: 'pointer',
            }}
          >
            SHADOW FORUM
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder='Поиск…'
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          {user && <CreateDiscussionFormDialog />}
          <Box sx={{
            display: {
              xs: 'none',
              md: 'flex',
            },
          }}>
            <IconButton size='large' color='inherit'>
              <Badge badgeContent={4} color='error'>
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size='large'
              color='inherit'
            >
              <Badge badgeContent={1} color='error'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size='large'
              edge='end'
              aria-label='account of current user'
              aria-haspopup='true'
              onClick={openProfileMenuHandler}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{
            display: {
              xs: 'flex',
              md: 'none',
            },
          }}>
            <IconButton
              size='large'
              aria-label='show more'
              aria-haspopup='true'
              onClick={openMobileMenuHandler}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default Header;
