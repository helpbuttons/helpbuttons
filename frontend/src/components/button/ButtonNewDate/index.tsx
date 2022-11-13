//is the component or element integrated in buttonNewPublish. Right before activate button. It displays the current selected date and a button to chang it, that ddisplays a picker with the date options for the net that's selecte
import { Picker, PickerSelector } from "components/picker/Picker";
import PickerPeriodDate from "components/picker/PickerPeriodDate";
import PickerDate from "components/picker/PickerDate";
import React, { useState } from "react";

export default function ButtonNewDate({ title, exact, ...props }) {
  const [showHideMenu, setHideMenu] = useState(false);
  const [pickerMode, setPickerMode] = useState("");

  let closeMenu = () => {
    setHideMenu(false);
    setPickerMode("");
  };
  return (
    <>
      <div className="form__field">
        <div className="card-button__date">
          {props.date && props.date}
          {!props.date && title}
        </div>
        <div className="btn" onClick={() => setHideMenu(!showHideMenu)}>
          Change date
        </div>
      </div>
      {showHideMenu && (
        <Picker setHideMenu={setHideMenu} onClosed={closeMenu}>
          {pickerMode == "" && (
            <PickerSelector
              label="Now"
              value="now"
              onHandleChange={setPickerMode}
            />
          )}
          {pickerMode == "" && (
            <PickerSelector
              label="Specific"
              value="specific"
              onHandleChange={setPickerMode}
            />
          )}
          {pickerMode == "" && (
            <PickerSelector
              label="Periodic Date"
              value="periodic"
              onHandleChange={setPickerMode}
            />
          )}
          {pickerMode == "now" && <PickerDate></PickerDate>}
          {pickerMode == "specific" && <PickerPeriodDate></PickerPeriodDate>}
          {pickerMode == "periodic" && <PickerPeriodDate></PickerPeriodDate>}
        </Picker>
      )}
    </>
  );
}
