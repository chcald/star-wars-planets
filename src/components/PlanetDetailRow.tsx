import { FC } from "react";

interface PlanetDetailRowProps {
  label: string;
  value: string | number | string[];
}

const PlanetDetailRow: FC<PlanetDetailRowProps> = ({ label, value }) => {
  return (
    <div className="planet-detail-row">
      <label htmlFor={label}>{label}: </label>
      <span id={label}>{value}</span>
    </div>
  );
};

export default PlanetDetailRow;
