import { ChangeEvent, FC, SyntheticEvent, useContext, useEffect, useState } from 'react';
import { Box, Container, Typography, Autocomplete, TextField } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import sayDayTime from '../../utils/SayDayTime';
import DiscussionsList from '../../components/lists/discussions-list/DiscussionsList';
import setPageTitle from '../../utils/SetPageTitle';
import { getUserName } from '../../store/selectors/authSelectors';
import { PageStyleContext } from '../../components/app/App';
import { discussionsApi } from '../../services/discussions.service';

const HomePage: FC = () => {
  const userName: string | null = useAppSelector(getUserName);
  const pageStyle = useContext(PageStyleContext);
  const [searchDiscussion, setSearchDiscussion] = useState<string>('');

  const changeSearchDiscussionHandler = (event: SyntheticEvent, newValue: string | null) => {
    if (newValue) {
      setSearchDiscussion(newValue);
    } else {
      setSearchDiscussion('');
    }
  };

  useEffect(() => {
    setPageTitle();
  }, []);

  const {
    data: discussions,
    isLoading: discussionsLoading,
    error: discussionsLoadingError,
  } = discussionsApi.useFetchAllDiscussionsQuery();

  const discussionNames = discussions && discussions.map(discussion => discussion.title);

  return (
    <Box
      sx={pageStyle}>
      <Container>
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: '2.5rem',
            textAlign: 'center',
            marginTop: '30px',
          }}>
          {sayDayTime(userName)}
        </Typography>
        <Typography
          mb={15}
          sx={{
            color: 'text.secondary',
            fontSize: '1.5rem',
            textAlign: 'center',
          }}>
          Добро пожаловать на SHADOW FORUM
        </Typography>
        <Autocomplete
          sx={{ marginBottom: '30px' }}
          options={discussionNames || []}
          inputValue={searchDiscussion}
          onInputChange={changeSearchDiscussionHandler}
          noOptionsText='Обсуждения не найдены'
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
          fontSize: '1.5rem',
        }}>{`${searchDiscussion.length ? 'Найденные' : 'Свежие'} обсуждения:`}</Typography>
        <DiscussionsList searchDiscussion={searchDiscussion} />
      </Container>
    </Box>
  );
};

export default HomePage;
