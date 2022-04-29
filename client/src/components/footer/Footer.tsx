import { Box, Typography } from '@mui/material';
import React from 'react';
import iMac from './iMac.png';
import dayjs from 'dayjs';

const Footer = () => {
  const currentYear = dayjs().year();
  return (
    <Box
      component='footer'
      display='flex'
      flexDirection={{ xs: 'column', sm: 'row' }}
      justifyContent='space-around'
      alignItems='center'
      padding='15px'
    >
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        marginBottom={{ xs: '15px', sm: 0 }}
      >
        <Typography color='text.secondary' textAlign='center'>
          SHADOW FORUM
        </Typography>
        <Box
          component='img'
          loading='lazy'
          src={iMac}
          sx={{ width: { xs: 50, sm: 70 }, pointerEvents: 'none', userSelect: 'none' }}
        />
      </Box>
      <Typography color='text.secondary' textAlign='center'>
        {`© 2021-${currentYear}, «Shadow Forum».`}
      </Typography>
    </Box>
  );
};

export default Footer;
