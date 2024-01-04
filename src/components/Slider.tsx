import { ReactNode } from "react";
import ReactSlider from "react-slider";

interface SliderProps {
  label: string | ReactNode;
  min: number;
  max: number;
  step?: number;
  minDistance?: number;
  value: Array<number>;
  defaultValue?: Array<number>;
  endValueLabel: string;
  startValueLabel: string;
  onChange: (values: number[]) => void;
}

const Slider = (props: SliderProps) => {
  const {
    label,
    min,
    max,
    step,
    value,
    minDistance,
    defaultValue,
    startValueLabel,
    endValueLabel,
    onChange,
  } = props;
  const controlProps = value ? { value } : { defaultValue };

  return (
    <div className="slider-container">
      {label}
      <div className="value-labels">
        <div id="slider-start-value">{startValueLabel}</div>
        <div id="slider-end-value">{endValueLabel}</div>
      </div>
      <div className="slider">
        <ReactSlider
          ariaLabelledby={["slider-start-value", "slider-end-value"]}
          className="slider-child"
          thumbClassName="slider-thumb"
          trackClassName="slider-track"
          min={min}
          max={max}
          step={step}
          minDistance={minDistance}
          onChange={onChange}
          {...controlProps}
        />
      </div>
    </div>
  );
};

export default Slider;
