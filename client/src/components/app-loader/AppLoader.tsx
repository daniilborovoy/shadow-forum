import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const AppLoader = () => (
  <Box
    sx={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <CircularProgress color='inherit' size={50} />
  </Box>
);

export default AppLoader;
