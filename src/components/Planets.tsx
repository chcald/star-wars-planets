import { FC, useState } from "react";
import PlanetList from "./PlanetList";
import { Planet } from "../types/planets/interfaces";

const Planets: FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  const handleSearch = (term: string) => {
    // Aquí se puede realizar la lógica de búsqueda
    // en este ejemplo, simplemente logueamos los resultados
    console.log("Search term:", term);
  };

  const handleSelect = (planet: Planet) => {
    setSelectedPlanet(planet);
  };

  return (
    <div className="main-container">
      <h1>Planetas de Star Wars</h1>
      <PlanetList onSearch={handleSearch} onSelect={handleSelect} />
      {selectedPlanet && (
        <div>
          <h2>Planeta seleccionado:</h2>
          <p>{JSON.stringify(selectedPlanet)}</p>
        </div>
      )}
    </div>
  );
};

export default Planets;
