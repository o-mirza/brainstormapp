import { createSlice } from '@reduxjs/toolkit';

export const mainSlice = createSlice({
  name: 'main',
  initialState: {
    // username, board ID, etc
    session: {},
    entries: [
      {
        id: 0,
        message: 'The first brainstorm idea',
        voteCount: 0,
        userVote: false
      },
      {
        id: 1,
        message: 'The second brainstorm idea: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
        voteCount: 0,
        userVote: false
      },
      {
        id: 2,
        message: 'The third brainstorm idea',
        voteCount: 0,
        userVote: false
      }
    ]
  },
  reducers: {
    addEntry: (state) => {
      // Placeholder: add new entry
      const newEntry = { id: 0, message: 'newEntry', voteCount: '0', userVote: null };
      state.entries.push(newEntry);
    },
    showPayload: (state, action) => console.log(action.payload),

    // Create function to change vote count for specific entry
    increaseVote: (state, action) => {
      // Get entry clicked
      const entry = state.entries.find(item => item.id === Number(action.payload))
      // Increase vote count for that entry
      if (!entry.userVote) {
        entry.voteCount++
        entry.userVote = true;
      } else {
        entry.voteCount--
        entry.userVote = false;
      }
    },
    loadChat: (state, action) => {
      // Completely replace state.
      // NOTE: This is dangerous; it would be better to validate data from the backend.
      console.log('Loading initial state.');
      return action.payload
    }
  },
});

// Export actions for use in components
export const { addEntry, showPayload, increaseVote, loadChat } = mainSlice.actions;

// Export the reducer function for store configuration
export default mainSlice.reducer;