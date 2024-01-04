import { ChangeEventHandler, FC } from "react";

interface ComboFilterProps {
  options: string[];
  filter: string;
  label: string;
  noSelectedLabel: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}

const ComboFilter: FC<ComboFilterProps> = ({
  options,
  filter,
  label,
  noSelectedLabel,
  onChange,
}) => {
  return (
    <div>
      <label>{label}:</label>
      <select value={filter || ""} onChange={onChange}>
        <option value="">{noSelectedLabel}</option>
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ComboFilter;
