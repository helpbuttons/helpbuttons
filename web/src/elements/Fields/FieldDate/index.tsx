//is the component or element integrated in buttonNewPublish. Right before activate button. It displays the current selected date and a button to chang it, that ddisplays a picker with the date options for the net that's selecte
import { Picker } from 'components/picker/Picker';
import React, { useState } from 'react';
import PickerSpecificDate from 'components/picker/PickerSpecificDate';
import {
  DateTypes,
  readableDate,
  readableTimeLeftToDate,
} from 'shared/date.utils';
import DebugToJSON from 'elements/Debug';

export default function FieldDate({
  title,
  dateType,
  dates,
  setDateType,
  setDate,
  ...props
}) {
  const [showHideMenu, setHideMenu] = useState(false);
  const [pickerMode, setPickerMode] = useState('');

  let closeMenu = () => {
    setHideMenu(false);
  };

  // https://www.npmjs.com/package/react-time-picker
  return (
    <>
      <div className="form__field">
        <ShowDate dates={dates} dateType={dateType} title={title} />
        <div
          className="btn"
          onClick={() => setHideMenu(!showHideMenu)}
        >
          Change date
        </div>
      </div>
      {showHideMenu && (
        <Picker closeAction={closeMenu}>
          {!dateType && (
            <>
              <div
                className="btn"
                onClick={() => setDateType(DateTypes.ALWAYS_ON)}
              >
                Always
              </div>
              <div
                className="btn"
                onClick={() => setDateType(DateTypes.ONCE)}
              >
                Once
              </div>
              <div
                className="btn"
                // onClick={() => setDateType(DateTypes.MULTIPLE)}
              >
                Multiple days
              </div>
              <div
                className="btn"
                // onClick={() => setDateType(DateTypes.RECURRENT)}
              >
                Recurrent
              </div>
            </>
          )}

          {dateType == DateTypes.ALWAYS_ON && <></>}
          {dateType == DateTypes.ONCE && (
            <>
              <PickerSpecificDate
                defaultDate={
                  dates && dates[0] ? dates[0] : new Date()
                }
                onChange={(datetime) => setDate([datetime])}
                closeMenu={closeMenu}
              ></PickerSpecificDate>
            </>
          )}
          {dateType == DateTypes.MULTIPLE && <></>}
          {dateType == DateTypes.RECURRENT && <></>}
          {dateType && (
            <div
              className="btn"
              onClick={() => {
                setDateType(null);
              }}
            >
              Change to other type
            </div>
          )}
          {dateType && (
            <>
              <ShowDate
                dates={dates}
                dateType={dateType}
                title={title}
              />
              <div className="btn" onClick={closeMenu}>
                Done
              </div>
            </>
          )}
        </Picker>
      )}
    </>
  );
}
export function ShowWhen({ when }) {
  const options = JSON.parse(when);
  return (
    <>
      {(
        <ShowDate
          dates={options?.dates}
          dateType={options?.type}
          title={'Always'}
        />
      )}
    </>
  );
}
export function ShowDate({ dates, dateType, title }) {
  return (
    <div className="card-button__date">
      {(!dateType || !dates) && <>{title}</>}
      {dateType == DateTypes.ALWAYS_ON && <>Always</>}
      {dateType == DateTypes.ONCE && dates && dates.length > 0 && (
        <>
          {`${readableDate(dates[0])} (${readableTimeLeftToDate(
            dates[0].toString(),
          )})`}
        </>
      )}
      {dateType == DateTypes.MULTIPLE && <></>}
      {dateType == DateTypes.RECURRENT && <></>}
    </div>
  );
}
