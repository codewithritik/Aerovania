import { createSlice } from '@reduxjs/toolkit';

const violationSlice = createSlice({
  name: 'violations',
  initialState: {
    violations: [],
    filteredViolations: [],
    filters: { droneId: '', date: '', type: '' },
  },
  reducers: {
    setViolations: (state, action) => {
      state.violations = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    applyFilters: (state) => {
      // filtering logic here
    },
  },
});

export const { setViolations, setFilters, applyFilters } = violationSlice.actions;
export default violationSlice.reducer; 