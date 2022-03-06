import { FC, useContext, useEffect } from 'react';
import { Box, Container, Typography, Autocomplete, TextField } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import sayDayTime from '../../utils/SayDayTime';
import DiscussionsList from '../../components/lists/discussions-list/DiscussionsList';
import setPageTitle from '../../utils/SetPageTitle';
import { getUserName } from '../../store/selectors/authSelectors';
import { PageStyleContext } from '../../components/app/App';

const HomePage: FC = () => {
  const userName: string | null = useAppSelector(getUserName);
  const pageStyle = useContext(PageStyleContext);

  useEffect(() => {
    setPageTitle();
  }, []);

  return (
    <Box
      sx={pageStyle}>
      <Container>
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: '5vmax',
            textAlign: 'center',
            marginTop: '30px',
          }}>
          {sayDayTime(userName)}
        </Typography>
        <Typography
          mb={15}
          sx={{
            color: 'text.secondary',
            fontSize: '3vmax',
            textAlign: 'center',
          }}>
          Добро пожаловать на SHADOW FORUM
        </Typography>
        <Autocomplete
          sx={{ marginBottom: '30px' }}
          options={[1, 2, 3, 5, 6]}
          renderInput={(params) => (
            <TextField
              {...params}
              variant='standard'
              fullWidth
              label='Название обсуждения'
              InputProps={{
                ...params.InputProps,
                type: 'search',
              }}
            />
          )}
        />
        <Typography mb={5} sx={{
          color: 'text.secondary',
          fontSize: '2.5vmax',
        }}>Свежие обсуждения:</Typography>
        <DiscussionsList />
      </Container>
    </Box>
  );
};

export default HomePage;
