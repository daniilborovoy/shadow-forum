import { Box, Fab, useScrollTrigger, Zoom } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { FC } from 'react';

const ScrollTopButton: FC = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 300,
  });

  const handleClick = () => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={trigger}>
      <Box
        title='Вернуться в начало'
        onClick={handleClick}
        role='presentation'
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Fab color='secondary' aria-label='scroll back to top'>
          <ArrowUpwardIcon />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default ScrollTopButton;
