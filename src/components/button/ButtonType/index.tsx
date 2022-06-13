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

export default function ButtonType({ handleChange, name, validationError }) {
  const [value, setValue] = useState("");

  let onChange = (name, value) => {
    setValue(value);
    handleChange(name, value);
  };
  return (
    <>
      <FieldRadio label="Choose your type:" validationError={validationError}>
        <FieldRadioOption handleChange={onChange} name={name} value="offer">
          <div className="btn-filter__icon green"></div>
          <div className="btn-with-icon__text">Offer</div>
        </FieldRadioOption>
        <FieldRadioOption handleChange={onChange} name={name} value="exchange">
          <div className="btn-filter__split-icon">
            <div className="btn-filter__split-icon--half green-l"></div>
            <div className="btn-filter__split-icon--half red-r"></div>
          </div>
          <div className="btn-with-icon__text">Exchange</div>
        </FieldRadioOption>
        <FieldRadioOption handleChange={onChange} name={name} value="need">
          <div className="btn-filter__icon red"></div>
          <div className="btn-with-icon__text">Need</div>
        </FieldRadioOption>
      </FieldRadio>
    </>
  );
}
