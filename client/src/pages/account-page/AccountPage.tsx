import { FC, useContext } from 'react';
import { PageStyleContext } from '../../components/app/App';
import { Grid, Box, Avatar, Container } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import { getUserName } from '../../store/selectors/authSelectors';

const AccountPage: FC = () => {
  const pageStyle = useContext(PageStyleContext);
  const userName = useAppSelector(getUserName);

  return (
    <Box sx={pageStyle}>
      <Container sx={{padding: '50px', minWidth: '100vh'}}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Avatar sx={{ width: 250, height: 250 }}>
              {userName}
            </Avatar>
          </Grid>
          <Grid item xs={8}>
            {userName}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AccountPage;
