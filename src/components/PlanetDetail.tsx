import { Planet } from "../types/planets/interfaces";
import PlanetDetailRow from "./PlanetDetailRow";
import ResidentDetails from "./ResidentDetails";

const PlanetDetail = ({ planet }: { planet: Planet }) => {
  return (
    <>
      <PlanetDetailRow label={"Name"} value={planet.name} />
      <PlanetDetailRow label={"Climate"} value={planet.climate} />
      <PlanetDetailRow label={"Gravity"} value={planet.gravity} />
      <PlanetDetailRow label={"Terrain"} value={planet.terrain} />
      <PlanetDetailRow label={"Orbital period"} value={planet.orbital_period} />
      <PlanetDetailRow label={"Surface water"} value={planet.surface_water} />
      <PlanetDetailRow label={"Diameter"} value={planet.diameter} />
      <PlanetDetailRow label={"Population"} value={planet.population} />
      <ResidentDetails residentsURL={planet.residents} />
    </>
  );
};

export default PlanetDetail;
