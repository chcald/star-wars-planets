import { useState, useEffect, ChangeEvent, useMemo, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlanets } from "../redux/slices/planetSlice";
import { AppDispatch } from "../redux/store";
import ComboFilter from "./ComboFilter";
import Slider from "./Slider";
import { Planet } from "../types/planets/interfaces";

interface PlanetListProps {
  onSearch: (term: string) => void;
  onSelect: (planet: Planet) => void;
}

const PlanetList: FC<PlanetListProps> = ({ onSearch, onSelect }) => {
  const dispatch = useDispatch<AppDispatch>();
  const planets = useSelector((state: any) => state.planets.data);
  const climateOptions = useSelector(
    (state: any) => state.planets.filters.climate.options
  );
  const terrainOptions = useSelector(
    (state: any) => state.planets.filters.terrain.options
  );
  const diameterMax = useSelector(
    (state: any) => state.planets.filters.diameter.max
  );
  const diameterMin = useSelector(
    (state: any) => state.planets.filters.diameter.min
  );

  const loading = useSelector((state: any) => state.planets.loading);
  // const error = useSelector((state: any) => state.planets.error);

  const [sortedPlanets, setSortedPlanets] = useState([...planets]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [diameterRange, setDiameterRange] = useState<[number, number]>([0, 0]);

  const [searchText, setSearchText] = useState<string>("");
  const [selectedClimate, setSelectedClimate] = useState<string>("");
  const [selectedTerrain, setSelectedTerrain] = useState<string>("");

  useEffect(() => {
    setDiameterRange([diameterMin, diameterMax]);
  }, [loading]);

  useEffect(() => {
    // Trigger action from Redux Toolkit to get planets
    dispatch(fetchPlanets());
  }, [dispatch]);

  const handleClimateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedClimate(event.target.value);
  };

  const handleTerrainChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTerrain(event.target.value);
  };

  const handleSearchTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    onSearch(e.target.value);
  };

  const handleSelect = (planet: Planet) => {
    onSelect(planet);
  };

  const handleDiameterChange = (values: number[]) => {
    setDiameterRange([values[0], values[1]]);
  };

  const handleSortOrderChange = () => {
    // Change the order from asc to desc and vice versa
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const applyFilters = () => {
    let filteredPlanets = [...planets];

    if (searchText.trim() !== "") {
      filteredPlanets = filteredPlanets.filter((planet) =>
        planet.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedClimate.trim() !== "") {
      filteredPlanets = filteredPlanets.filter((planet) =>
        planet.climate.toLowerCase().includes(selectedClimate.toLowerCase())
      );
    }

    if (selectedTerrain.trim() !== "") {
      filteredPlanets = filteredPlanets.filter((planet) =>
        planet.terrain.toLowerCase().includes(selectedTerrain.toLowerCase())
      );
    }

    const filteredByDiameter = filteredPlanets.filter((planet) => {
      const diameter = Number(planet.diameter);
      return diameter >= diameterRange[0] && diameter <= diameterRange[1];
    });

    // const sortedByDiameter = filteredByDiameter.sort((a, b) => {
    //   const diameterA = Number(a.diameter);
    //   const diameterB = Number(b.diameter);
    //   return diameterA - diameterB;
    // });

    // Apply sorting to the "name" field
    const sortedPlanets = filteredByDiameter.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return sortedPlanets;
  };

  const filteredAndSortedPlanets = useMemo(
    () => applyFilters(),
    [
      searchText,
      selectedClimate,
      selectedTerrain,
      diameterRange,
      planets,
      sortOrder,
    ]
  );

  useEffect(() => {
    setSortedPlanets(filteredAndSortedPlanets);
  }, [filteredAndSortedPlanets]);

  const clearFilters = () => {
    setSortOrder("asc");
    setDiameterRange([diameterMin, diameterMax]);
    setSortedPlanets([...planets]);
    setSelectedClimate("");
    setSelectedTerrain("");
    setSearchText("");
  };

  return (
    <>
      {loading === "loading" && <p>Loading...</p>}
      <div className="filters-container">
        <div className="inputs-container">
          <div>
            <label htmlFor="textId">Planet name:</label>
            <input
              id="textId"
              type="text"
              placeholder={`Search by Name`}
              value={searchText}
              onChange={handleSearchTextChange}
            />
          </div>
          <ComboFilter
            options={climateOptions}
            filter={selectedClimate}
            noSelectedLabel="All climates"
            label="Climate"
            onChange={handleClimateChange}
          />
          <ComboFilter
            options={terrainOptions}
            filter={selectedTerrain}
            noSelectedLabel="All terrains"
            label="Terrain"
            onChange={handleTerrainChange}
          />
        </div>
        <div className="slider-filter">
          <Slider
            value={diameterRange}
            onChange={handleDiameterChange}
            min={diameterMin}
            max={diameterMax}
            step={100}
            label="Diameter:"
            startValueLabel={String(diameterMin)}
            endValueLabel={String(diameterMax)}
          />
        </div>
        <button className="clear-button" onClick={clearFilters}>
          <span>Clear filters ⟲</span>
        </button>
      </div>
      <table
        align="center"
        width="100%"
        border={1}
        cellSpacing="0"
        cellPadding="4"
      >
        <thead>
          <tr>
            <th>
              Name{" "}
              <button onClick={() => handleSortOrderChange()}>
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </th>
            <th>Climate</th>
            <th>Terrain</th>
            <th>Diameter</th>
            <th>Gravity</th>
            <th>Surface water</th>
            <th>Population</th>
          </tr>
        </thead>
        <tbody className="sortable">
          {sortedPlanets.map((planet: any) => (
            <tr key={planet.name} onClick={() => handleSelect(planet)}>
              <td>{planet.name} </td>
              <td>{planet.climate}</td>
              <td>{planet.terrain}</td>
              <td>{planet.diameter}</td>
              <td>{planet.gravity}</td>
              <td>{planet.surface_water}</td>
              <td>{planet.population}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default PlanetList;
