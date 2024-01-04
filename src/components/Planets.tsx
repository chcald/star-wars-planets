import { FC, useState } from "react";
import PlanetList from "./PlanetList";
import { Planet } from "../types/planets/interfaces";

const Planets: FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  const handleSearch = (term: string) => {
    // Here you can perform the search logic
    console.log("Search term:", term);
  };

  const handleSelect = (planet: Planet) => {
    setSelectedPlanet(planet);
  };

  return (
    <div className="main-container">
      <h1>Star Wars planets</h1>
      <PlanetList onSearch={handleSearch} onSelect={handleSelect} />
      {selectedPlanet && (
        <div>
          <h2>Selected planet:</h2>
          <p>{JSON.stringify(selectedPlanet)}</p>
        </div>
      )}
    </div>
  );
};

export default Planets;
