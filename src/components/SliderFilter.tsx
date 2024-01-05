import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { ReactNode } from "react";

interface SliderProps {
  label: string | ReactNode;
  min: number;
  max: number;
  step?: number;
  value: number[];
  endValueLabel: string;
  startValueLabel: string;
  onChange: (value: number | number[]) => void;
}

const SliderFilter = (props: SliderProps) => {
  const {
    label,
    min,
    max,
    step,
    value,
    startValueLabel,
    endValueLabel,
    onChange,
  } = props;
  return (
    <div className="slider-container">
      {label}
      <div className="value-labels">
        <div id="slider-start-value">{startValueLabel}</div>
        <div id="slider-end-value">{endValueLabel}</div>
      </div>
      <div className="slider">
        <Slider
          dots
          step={step}
          range
          min={min}
          max={max}
          defaultValue={[0, 0]}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SliderFilter;
