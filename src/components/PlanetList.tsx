import { useState, useEffect, ChangeEvent, useMemo, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlanets } from "../redux/slices/planetSlice";
import { AppDispatch } from "../redux/store";
import ComboFilter from "./ComboFilter";
import SliderFilter from "./SliderFilter";
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
  const error = useSelector((state: any) => state.planets.error);

  const [sortedPlanets, setSortedPlanets] = useState([...planets]);
  const [sortBy, setSortBy] = useState<"name" | "population" | "diameter" | "">(
    ""
  );
  const [sortOrderName, setSortOrderName] = useState<"asc" | "desc">("asc");
  const [sortOrderPopulation, setSortOrderPopulation] = useState<
    "asc" | "desc"
  >("asc");
  const [sortOrderDiameter, setSortOrderDiameter] = useState<"asc" | "desc">(
    "asc"
  );

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

  const handleDiameterChange = (values: number | number[]) => {
    if (Array.isArray(values)) setDiameterRange([values[0], values[1]]);
  };

  const handleSortOrderChange = (
    field: "name" | "population" | "diameter" | ""
  ) => {
    // Change the order from asc to desc and vice versa depending on the field
    if (field === "name") {
      setSortOrderName((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else if (field === "population") {
      setSortOrderPopulation((prevOrder) =>
        prevOrder === "asc" ? "desc" : "asc"
      );
    } else if (field === "diameter") {
      setSortOrderDiameter((prevOrder) =>
        prevOrder === "asc" ? "desc" : "asc"
      );
    }

    setSortBy(field);
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

    let sortedPlanets = null;
    if (sortBy === "name") {
      // Apply sorting to the "name" field
      sortedPlanets = filteredByDiameter.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (sortOrderName === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }
    if (sortBy === "diameter") {
      // Apply sorting to the "diameter" field
      sortedPlanets = filteredByDiameter.sort((a, b) => {
        const diameterA = Number(a.diameter);
        const diameterB = Number(b.diameter);

        if (sortOrderDiameter === "asc") {
          return diameterA - diameterB;
        } else {
          return diameterB - diameterA;
        }
      });
    }

    if (sortBy === "population") {
      // Apply sorting to the "diameter" field
      sortedPlanets = filteredByDiameter.sort((a, b) => {
        const populationA = Number(a.population);
        const populationB = Number(b.population);

        if (sortOrderPopulation === "asc") {
          return populationA - populationB;
        } else {
          return populationB - populationA;
        }
      });
    }

    return sortedPlanets || filteredByDiameter;
  };

  const filteredAndSortedPlanets = useMemo(
    () => applyFilters(),
    [
      searchText,
      selectedClimate,
      selectedTerrain,
      diameterRange,
      planets,
      sortOrderName,
      sortOrderPopulation,
      sortOrderDiameter,
    ]
  );

  useEffect(() => {
    setSortedPlanets(filteredAndSortedPlanets);
  }, [filteredAndSortedPlanets]);

  const clearFilters = () => {
    setSortOrderName("asc");
    setSortOrderPopulation("asc");
    setSortOrderDiameter("asc");
    setDiameterRange([diameterMin, diameterMax]);
    setSortedPlanets([...planets]);
    setSelectedClimate("");
    setSelectedTerrain("");
    setSearchText("");
  };

  return (
    <>
      {loading === "loading" && <p>Loading...</p>}
      {error && <div className="error-message">{error}</div>}
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
          <SliderFilter
            value={diameterRange}
            onChange={handleDiameterChange}
            min={diameterMin}
            max={diameterMax}
            step={1000}
            label="Diameter:"
            startValueLabel={String(diameterMin)}
            endValueLabel={String(diameterMax)}
          />
        </div>
        <button className="clear-button btn" onClick={clearFilters}>
          <span>Clear filters ⟲</span>
        </button>
      </div>
      {sortedPlanets.length > 0 ? (
        <table
          align="center"
          width="100%"
          border={1}
          cellSpacing="0"
          cellPadding="3"
        >
          <thead>
            <tr>
              <th>
                Name{" "}
                <button
                  className="btn"
                  onClick={() => handleSortOrderChange("name")}
                >
                  {sortOrderName === "asc" ? "↑" : "↓"}
                </button>
              </th>
              <th>Climate</th>
              <th>Terrain</th>
              <th>
                Diameter{" "}
                <button
                  className="btn"
                  onClick={() => handleSortOrderChange("diameter")}
                >
                  {sortOrderDiameter === "asc" ? "↑" : "↓"}
                </button>
              </th>
              <th>
                Population{" "}
                <button
                  className="btn"
                  onClick={() => handleSortOrderChange("population")}
                >
                  {sortOrderPopulation === "asc" ? "↑" : "↓"}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="sortable">
            {sortedPlanets.map((planet: Planet) => (
              <tr key={planet.name} onClick={() => handleSelect(planet)}>
                <td>{planet.name} </td>
                <td>{planet.climate}</td>
                <td>{planet.terrain}</td>
                <td>{planet.diameter}</td>
                <td>{planet.population}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No matches found</p>
      )}
    </>
  );
};

export default PlanetList;
