//This is the first section in the button creation process, but can be displayed or not depending on the selected network settings. It displays the buttons types (default offer an need and exchange) and leads to ButtonNewData after selection
import FieldRadio from "elements/Fields/FieldRadio";
import FieldRadioOption from "elements/Fields/FieldRadio/option";
import { useState } from "react";

import CrossIcon from "../../../../public/assets/svg/icons/cross1";
type IconType = "cross" | "red";

function RadioIcon({ icon }: { icon: IconType }) {
  switch (icon) {
    case "cross":
      return (
        <div className="checkbox__icon">
          <CrossIcon />
        </div>
      );
    case "red":
      return <div className="btn-filter__icon red"></div>;
    default:
      return null;
  }
}

export default function ButtonType({
  handleChange,
  name,
  validationError,
  icon,
}) {
  const [value, setValue] = useState("");

  let onChange = (name, value) => {
    setValue(value);
    handleChange(name, value);
  };
  return (
    <>
      radio::
      <input type="radio" value="offer" />
      Offer
      <input type="radio" value="exchange" />
      Exchange
      <input type="radio" value="need" />
      need
      <div className="radio">
        <label className="radio__label">
          <input type="radio" className="radio__radio" name={name}></input>
          <div className={`radio__content ${value ? "checked" : ""}`}>
            <RadioIcon icon={icon} />
            <div className="radio__text">{name}</div>
          </div>
        </label>
      </div>
      {value}
      <FieldRadio label="Choose your type:" validationError={validationError}>
        <FieldRadioOption handleChange={onChange} name={name} value="offer">
          <div className="btn-filter__icon green"></div>
          <div className="btn-with-icon__text">Offer</div>
        </FieldRadioOption>
        <FieldRadioOption handleChange={onChange} name={name} value="exchange">
          a
        </FieldRadioOption>
        <FieldRadioOption handleChange={onChange} name={name} value="need">
          <div className="btn-filter__icon red"></div>
          <div className="btn-with-icon__text">Need</div>
        </FieldRadioOption>
      </FieldRadio>
    </>
  );
}
