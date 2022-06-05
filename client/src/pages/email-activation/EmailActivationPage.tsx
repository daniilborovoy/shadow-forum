import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Done, ReportGmailerrorred } from '@mui/icons-material';
import { Button, CircularProgress, Dialog, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setEmailActivationState } from '../../store/reducers/AuthSlice';

const EmailActivationPage = () => {
  const params = useParams();
  const activationLink = params.activationLink;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string>('');

  const activate = async () => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/activate/${activationLink}`);
  };


  const goToHomeHandler = () => {
    navigate('/');
  };

  useEffect(() => {
    activate()
      .then((res: AxiosResponse<{ email: string }>) => {
        setError(null);
        setUserEmail(res.data.email);
        dispatch(setEmailActivationState(true));
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Dialog open>
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          textAlign='center'
          sx={{ padding: '30px', margin: '0 15px' }}
        >
          <Typography mb={5}>Активируем почту</Typography>
          <CircularProgress color='inherit' disableShrink />
        </Box>
      </Dialog>
    );
  }

  return (
    <>
      {error ? (
        <Dialog open>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            textAlign='center'
            sx={{ padding: '30px', margin: '0 15px' }}
          >
            <ReportGmailerrorred color='error' />
            <Typography fontSize='20px' color='text.error' textAlign='center'>
              Ошибка при активации почты!
            </Typography>
            <Typography fontSize='18px' color='text.secondary' textAlign='center'>
              Описание
            </Typography>
            <Typography color='text.secondary' mb={5} textAlign='justify'>
              {error}
            </Typography>
            <Button variant='contained' onClick={goToHomeHandler}>
              Вернуться
            </Button>
          </Box>
        </Dialog>
      ) : (
        <Dialog open>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            textAlign='center'
            sx={{ padding: '30px', margin: '0 15px' }}
          >
            <Done color='success' />
            <Typography mb={5} fontSize='20px' color='text.success' textAlign='center'>
              Аккаунт {userEmail} успешно активирован!
            </Typography>
            <Button variant='contained' onClick={goToHomeHandler}>
              Вернуться
            </Button>
          </Box>
        </Dialog>
      )}
    </>
  );
};

export default EmailActivationPage;
