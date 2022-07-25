//This is the first section in the button creation process, but can be displayed or not depending on the selected network settings. It displays the buttons types (default offer an need and exchange) and leads to ButtonNewData after selection
import FieldError from "elements/Fields/FieldError";
import FieldRadio from "elements/Fields/FieldRadio";
import { FieldRadioOption } from "elements/Fields/FieldRadio/option";
import React from "react";
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

export const ButtonType = React.forwardRef(({name, onChange, validationError}, ref) => {
  return (
        <>
       <FieldRadio label="Button type:">
       <FieldError validationError={validationError}/>
       <FieldRadioOption
          onChange={onChange} 
          name={name}
          ref={ref} 
          value="need"
        >
          <div className="btn-filter__icon red"></div>
          <div className="btn-with-icon__text">Need</div>
        </FieldRadioOption>
        <FieldRadioOption
          onChange={onChange} 
          name={name}
          ref={ref} 
          value="offer"
        >
          <div className="btn-filter__icon green"></div>
          <div className="btn-with-icon__text">Offer</div>
        </FieldRadioOption>
       </FieldRadio>
    </>
  )
});