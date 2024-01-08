import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Planet, Resident } from "../../types/planets/interfaces";

// Asynchronous action using Redux Toolkit
export const fetchPlanets = createAsyncThunk<Planet[], void>(
  "planets/fetchPlanets",
  async () => {
    const response = await axios.get("https://swapi.dev/api/planets/");
    return response.data.results as Planet[];
  }
);

// Asynchronous action for fetching residents based on URL
export const fetchResident = createAsyncThunk<Resident, string>(
  "planets/fetchResident",
  async (url: string) => {
    const response = await axios.get(url);
    return response.data as Resident;
  }
);

// Redux Toolkit Slice
const planetSlice = createSlice({
  name: "planets",
  initialState: {
    data: [] as Planet[],
    residents: [] as Resident[],
    loadingResidents: "idle",
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
      })
      .addCase(fetchResident.pending, (state) => {
        state.loadingResidents = "loading";
      })
      .addCase(fetchResident.fulfilled, (state, action: PayloadAction<Resident>) => {
        // Handle fulfilled state for fetchResidents
        state.loadingResidents = "idle";
        state.residents.push(action.payload); // Add the fetched resident to the array
      })
      .addCase(fetchResident.rejected, (state, action) => {
        // Handle rejected state for fetchResidents
        state.loadingResidents = "idle";
        state.error = `Error fetching residents: ${String(
          action.error.message
        )}`;
      });
  },
});

export default planetSlice.reducer;
