import React, { FC, useState, MouseEvent, ChangeEvent } from 'react';
import { authApi } from '../../services/auth.service';
import { useAppSelector } from '../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  MenuItem,
  Button,
  Menu,
  ListItemIcon,
  Avatar,
  Divider,
} from '@mui/material';
import { Search as SearchIcon, AccountCircle, MoreVert as MoreIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { getUser } from '../../store/selectors/authSelectors';
import { CreateDiscussionDialog } from '../forms/create-discussion-dialog/CreateDiscussionDialog';
import { stringAvatar } from '../../utils/Avatar';

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

  const [logout, { isLoading: logoutLoading, error: logoutError }] = authApi.useLogoutMutation();

  const user = useAppSelector(getUser);
  const [settingsSearch, setSettingsSearch] = useState<string>('');

  const changeSettingsSearchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSettingsSearch(event.target.value);
  };

  const isMenuOpen = Boolean(anchorEl);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const goHomeHandler = () => {
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
  };

  const goToMyDiscussionsHandler = () => {
    closeMenuHandler();
    navigate('/settings/discussions');
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
            <Avatar {...stringAvatar(user.name)} />
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
      <AppBar component='div' position='relative' sx={{ padding: '0 15px' }}>
        <Toolbar>
          <Typography
            fontSize='20px'
            noWrap
            component='a'
            onClick={goHomeHandler}
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
              },
              cursor: 'pointer',
              userSelect: 'none',
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
              type='search'
              value={settingsSearch}
              onChange={changeSettingsSearchHandler}
            />
          </Search>
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
                >
                  <AccountCircle />
                </IconButton>
              </>
            ) : window.location.pathname !== '/authorize' ? (
              <Button variant='contained' color='secondary' onClick={goToAuthorizeHandler}>
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
