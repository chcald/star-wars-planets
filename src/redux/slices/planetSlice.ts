import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Planet } from "../../types/planets/interfaces";

// Asynchronous action using Redux Toolkit
export const fetchPlanets = createAsyncThunk(
  "planets/fetchPlanets",
  async () => {
    const response = await axios.get("https://swapi.dev/api/planets/");
    return response.data.results;
  }
);

// Redux Toolkit Slice
const planetSlice = createSlice({
  name: "planets",
  initialState: {
    data: [],
    filters: {
      climate: { options: [] as string[] },
      terrain: { options: [] as string[] },
      diameter: { max: 0, min: 0 },
    },
    loading: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanets.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchPlanets.fulfilled, (state, action) => {
        state.loading = "idle";
        state.data = action.payload;
        try {
          state.filters.climate.options = Array.from(
            new Set(state.data.map((planet: Planet) => planet.climate))
          );
          state.filters.terrain.options = Array.from(
            new Set(state.data.map((planet: Planet) => planet.terrain))
          );
          const diameterOptions: number[] = state.data.map(
            (planet: Planet) => planet.diameter
          );
          state.filters.diameter.max = Math.max(...diameterOptions);
          state.filters.diameter.min = Math.min(...diameterOptions);
        } catch (error) {
          // Capture and handle specific errors in business logic
          state.error = `Error getting filter options: ${String(error)}`;
        }
      })
      .addCase(fetchPlanets.rejected, (state, action) => {
        state.loading = "idle";
        state.error = `Error: ${String(action.error.message)}`;
      });
  },
});

export default planetSlice.reducer;
