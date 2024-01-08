import { FC, useState, useRef } from "react";
import PlanetList from "./PlanetList";
import { Planet } from "../types/planets/interfaces";
import PlanetDetail from "./PlanetDetail";

const Planets: FC = () => {
  const ref = useRef<null | HTMLDivElement>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  const handleSelect = (planet: Planet) => {
    setSelectedPlanet(planet);
    // The setTimeout is because the first time you click on the table the element does not exist
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <div className="main-container">
      <h1>Star Wars planets</h1>
      <PlanetList onSelect={handleSelect} />
      {selectedPlanet && (
        <div ref={ref}>
          <h2>Detail planet:</h2>
          <PlanetDetail planet={selectedPlanet} />
        </div>
      )}
    </div>
  );
};

export default Planets;
