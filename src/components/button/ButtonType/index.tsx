//This is the first section in the button creation process, but can be displayed or not depending on the selected network settings. It displays the buttons types (default offer an need and exchange) and leads to ButtonNewData after selection
import FieldRadio from "elements/Fields/FieldRadio";
import FieldRadioOption from "elements/Fields/FieldRadio/option";
import { useState } from "react";

import { IoClose } from "react-icons/io5";
type IconType = "cross" | "red";

function RadioIcon({ icon }: { icon: IconType }) {
  switch (icon) {
    case "cross":
      return (
        <div className="checkbox__icon">
          <IoClose />
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
      <FieldRadio label="Button type:" validationError={validationError}>
        <FieldRadioOption handleChange={onChange} name={name} value="need" isChecked={value === "need"}>
          <div className="btn-filter__icon red"></div>
          <div className="btn-with-icon__text">Need</div>
        </FieldRadioOption>
        <FieldRadioOption handleChange={onChange} name={name} value="offer" isChecked={value === "offer"}>
          <div className="btn-filter__icon green"></div>
          <div className="btn-with-icon__text">Offer</div>
        </FieldRadioOption>
      </FieldRadio>
    </>
  );
}
