import React from 'react';
import { Grid, Skeleton } from '@mui/material';

const MyDiscussionsSkeleton = () => (
  <Grid justifyContent='center' container gap={5}>
    <Grid item>
      <Skeleton
        animation='wave'
        sx={{ borderRadius: '24px', width: { sm: 345, xs: 260 } }}
        variant='rectangular'
        height={200}
      />
    </Grid>
    <Grid item>
      <Skeleton
        animation='wave'
        sx={{ borderRadius: '24px', width: { sm: 345, xs: 260 } }}
        variant='rectangular'
        height={200}
      />
    </Grid>
    <Grid item>
      <Skeleton
        animation='wave'
        sx={{ borderRadius: '24px', width: { sm: 345, xs: 260 } }}
        variant='rectangular'
        height={200}
      />
    </Grid>
    <Grid item>
      <Skeleton
        animation='wave'
        sx={{ borderRadius: '24px', width: { sm: 345, xs: 260 } }}
        variant='rectangular'
        height={200}
      />
    </Grid>
    <Grid item>
      <Skeleton
        animation='wave'
        sx={{ borderRadius: '25px', width: { sm: 345, xs: 260 } }}
        variant='rectangular'
        height={200}
      />
    </Grid>
    <Grid item>
      <Skeleton
        animation='wave'
        sx={{ borderRadius: '25px', width: { sm: 345, xs: 260 } }}
        variant='rectangular'
        height={200}
      />
    </Grid>
  </Grid>
);

export default MyDiscussionsSkeleton;
