import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DiscussionState {
}

const initialState: DiscussionState = {};

const DiscussionSlice = createSlice({
  name: 'discussion',
  initialState,
  reducers: {},
  extraReducers: {},
});

export default DiscussionSlice.reducer;
