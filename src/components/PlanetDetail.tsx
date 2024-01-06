import { Planet } from "../types/planets/interfaces";
import PlanetDetailRow from "./PlanetDetailRow";

const PlanetDetail = ({ planet }: { planet: Planet }) => {
  return (
    <>
      <PlanetDetailRow label={"Name"} value={planet.name} />
      <PlanetDetailRow label={"Climate"} value={planet.climate} />
      <PlanetDetailRow label={"Gravity"} value={planet.gravity} />
      <PlanetDetailRow label={"Terrain"} value={planet.terrain} />
      <PlanetDetailRow label={"Orbital period"} value={planet.orbital_period} />
      <PlanetDetailRow label={"Population"} value={planet.population} />
      <PlanetDetailRow label={"Surface water"} value={planet.surface_water} />
      <PlanetDetailRow label={"Diameter"} value={planet.diameter} />
    </>
  );
};

export default PlanetDetail;

