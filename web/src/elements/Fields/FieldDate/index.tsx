//is the component or element integrated in buttonNewPublish. Right before activate button. It displays the current selected date and a button to chang it, that ddisplays a picker with the date options for the net that's selecte
import { Picker, PickerSelector } from "components/picker/Picker";
import PickerPeriodDate from "components/picker/PickerPeriodDate";
import PickerDate from "components/picker/PickerDate";
import React, { useState } from "react";
import PickerSpecificDate from "components/picker/PickerSpecificDate";
import { getLocale } from "shared/sys.helper";

export default function FieldDate({ title, ...props }) {
  const [showHideMenu, setHideMenu] = useState(false);
  const [pickerMode, setPickerMode] = useState("");
  const [date, setDate] = useState(new Date());
  
  let closeMenu = () => {
    setHideMenu(false);
    setPickerMode("");
  };
  // https://www.npmjs.com/package/react-time-picker
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
            <div className="btn" onClick={closeMenu}>
            Done
          </div>

            <span>
            You selected this time is{' '}
            {date.toLocaleDateString(getLocale(), {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            })}
          </span>
          {/* {pickerMode == "" && (
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
          {pickerMode == "specific" && <PickerSpecificDate></PickerSpecificDate>}
          {pickerMode == "periodic" && <PickerPeriodDate></PickerPeriodDate>}*/}
          <PickerSpecificDate onChange={setDate} closeMenu={closeMenu}></PickerSpecificDate>
        </Picker>
      )}
    </>
  );
}
