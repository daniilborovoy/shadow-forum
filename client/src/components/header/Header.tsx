import React, { FC, MouseEvent, useState } from 'react';
import { authApi } from '../../services/auth.service';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { AccountCircle, MoreVert as MoreIcon } from '@mui/icons-material';
import { getUser } from '../../store/selectors/authSelectors';
import { CreateDiscussionDialog } from '../create-discussion-dialog/CreateDiscussionDialog';
import { stringAvatar } from '../../utils/Avatar';
import { discussionsApi } from '../../services/discussions.service';

const Header: FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const [logout] = authApi.useLogoutMutation();

  const user = useAppSelector(getUser);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const goHomeHandler = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
  };

  const goToSettingsHandler = () => {
    closeMenuHandler();
    navigate('/settings');
  };

  const logoutHandler = async (): Promise<void> => {
    closeMenuHandler();
    await logout();
    navigate('/authorize');
    dispatch(discussionsApi.internalActions.resetApiState());
  };

  const goToMyDiscussionsHandler = () => {
    navigate('/my-discussions');
    closeMenuHandler();
  };

  const goToAuthorizeHandler = () => {
    navigate('/authorize');
    closeMobileMenuHandler();
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

  const menu = (
    <Dialog open={isMenuOpen}>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disableScrollLock
        open={isMenuOpen}
        onClose={closeMenuHandler}
      >
        {user && (
          <Box>
            <Box
              display='flex'
              flexDirection='row'
              justifyContent='center'
              alignItems='center'
              sx={{ padding: '10px 15px', textAlign: 'center' }}
            >
              <Avatar src={user.avatar} {...stringAvatar(user.name)} alt={user.name} sx={{ pointerEvents: 'none' }} />
              <Typography sx={{ marginLeft: '15px' }}>{user.email}</Typography>
            </Box>
            <Divider flexItem />
            <MenuItem onClick={goToSettingsHandler}>
              <ListItemIcon>
                <Settings fontSize='small' />
              </ListItemIcon>
              Настройки аккаунта
            </MenuItem>
            <MenuItem onClick={goToMyDiscussionsHandler}>
              <ListItemIcon>
                <FeaturedPlayListIcon fontSize='small' />
              </ListItemIcon>
              Мои обсуждения
            </MenuItem>
            <MenuItem onClick={logoutHandler}>
              <ListItemIcon>
                <Logout fontSize='small' />
              </ListItemIcon>
              Выйти из аккаунта
            </MenuItem>
          </Box>
        )}
      </Menu>
    </Dialog>
  );

  const mobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      disableScrollLock
      open={isMobileMenuOpen}
      onClose={closeMobileMenuHandler}
    >
      {user ? (
        <Box>
          <MenuItem onClick={openProfileMenuHandler}>
            <IconButton size='large' aria-haspopup='true' color='inherit'>
              <AccountCircle />
            </IconButton>
            <p>Профиль</p>
          </MenuItem>
          <CreateDiscussionDialog type='mobile' />
        </Box>
      ) : (
        <Button color='secondary' variant='text' onClick={goToAuthorizeHandler}>
          Войти
        </Button>
      )}
    </Menu>
  );

  return (
    <Box
      component='header'
      sx={{ flexGrow: 1, position: 'fixed', width: '100vw', top: '0', left: 0, zIndex: '100' }}
    >
      <AppBar component='div' position='relative' sx={{ padding: '0 15px', borderRadius: 0 }}>
        <Toolbar>
          <Typography
            fontSize='20px'
            fontWeight='bold'
            noWrap
            color='secondary'
            component='a'
            href='/'
            onClick={goHomeHandler}
            sx={{
              textDecoration: 'none',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            SHADOW FORUM
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex', marginRight: '15px' } }}>
            {user && <CreateDiscussionDialog type='desktop' />}
          </Box>
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
            }}
          >
            {user ? (
              <>
                <IconButton
                  size='large'
                  edge='end'
                  aria-haspopup='true'
                  onClick={openProfileMenuHandler}
                  color='inherit'
                  sx={{ padding: '5px' }}
                >
                  <Avatar src={user.avatar} {...stringAvatar(user.name)} alt={user.name}
                          sx={{ pointerEvents: 'none' }} />
                </IconButton>
              </>
            ) : window.location.pathname !== '/authorize' ? (
              <Button
                variant='contained'
                sx={{ fontWeight: 700 }}
                color='secondary'
                onClick={goToAuthorizeHandler}
              >
                Войти
              </Button>
            ) : null}
          </Box>
          {window.location.pathname !== '/authorize' && (
            <Box
              sx={{
                display: {
                  xs: 'flex',
                  md: 'none',
                },
              }}
            >
              <IconButton
                size='large'
                aria-haspopup='true'
                onClick={openMobileMenuHandler}
                color='inherit'
              >
                <MoreIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {mobileMenu}
      {menu}
    </Box>
  );
};

export default Header;
