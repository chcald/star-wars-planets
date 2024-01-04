import { configureStore } from '@reduxjs/toolkit';
import planetReducer from './slices/planetSlice';

const store = configureStore({
  reducer: {
    planets: planetReducer,
  },
});

export type AppDispatch = typeof store.dispatch
export default store;
