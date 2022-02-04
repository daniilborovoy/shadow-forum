import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {User} from '../../models/user.model'

interface DiscussionState {
  isLoading: boolean;
  isAuth: boolean;
  user?: User;
  error?: string;
}

const initialState: DiscussionState = {
  isLoading: false,
  isAuth: false
}

const DiscussionSlice = createSlice({
  name: 'discussion',
  initialState,
  reducers: {},
  extraReducers: {}
})


export default DiscussionSlice.reducer;
