import { ChangeEvent, FC, useCallback, useContext, useRef, useState } from 'react';
import { PageStyleContext } from '../../components/app/App';
import {
  Grid,
  Box,
  Avatar,
  Container,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField, Button,
} from '@mui/material';
import { User } from '../../models/user.model';

interface AccountPageProps {
  user: User;
}

const AccountPage: FC<AccountPageProps> = ({ user }) => {
  const pageStyle = useContext(PageStyleContext);
  const [userName, setUserName] = useState<string>(user.name);
  const [userEmail, setUserEmail] = useState<string>(user.email);
  const activated = user.isActivated;
  const currentUserName = useRef(userName);
  const currentUserEmail = useRef(userEmail);

  const changeNameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.match(/^\S*$/)) {
      setUserName(event.target.value);
    }
  };
  const changeEmailHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.match(/^\S*$/)) {
      setUserEmail(event.target.value);
    }
  };

  const showUpdateButton = useCallback(() => {
    if ((currentUserEmail.current !== userEmail) || (currentUserName.current !== userName)) return false;
    return true;
  }, [userEmail, userName]);

  const disableBtn = showUpdateButton();

  return (
    <Box sx={pageStyle}>
      <Container sx={{ padding: '50px', minWidth: '100vh' }}>
        <Grid container spacing={2} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Grid item xs={4}>
          </Grid>
          <Grid item xs={8}>
            <Typography fontSize={30}>Информация об аккаунте</Typography>
            <Typography>id: {user.id}</Typography>
            <Avatar sx={{ width: '150px', height: '150px' }}>
              {currentUserName.current}
            </Avatar>
            <Typography>
              Имя:
            </Typography>
            <TextField
              helperText='Ваше имя может отобразиться на ShadowForum, где вы участвуете или упоминаетесь. Вы можете изменить его в любое время.'
              placeholder={userName} value={userName} onChange={changeNameHandler} />
            <Typography>Email:</Typography>
            <TextField value={userEmail} onChange={changeEmailHandler} />
            <Typography>
              Account URL:
            </Typography>
            <TextField
              helperText='Вы можете поменять адрес своей личной страницы на ShadowForum.'
              value={`https://${window.location.hostname}/${user.id}`} />
            <FormGroup>
              <FormControlLabel checked={activated} disabled={activated} control={<Checkbox />}
                                label={activated ? 'Аккаунт подтверждён!' : 'Аккаунт не подтверждён!'} />
            </FormGroup>
            <Button variant='contained' disabled={disableBtn}>
              Обновить аккаунт
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AccountPage;
