//is the component or element integrated in buttonNewPublish. Right before activate button. It displays the current selected date and a button to chang it, that ddisplays a picker with the date options for the net that's selecte
import { Picker } from 'components/picker/Picker';
import React, { useRef, useState } from 'react';
import PickerSpecificDate from 'components/picker/PickerSpecificDate';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import {
  DateTypes,
  readableDate,
  readableDateTime,
  readableTime,
  readableTimeLeftToDate,
} from 'shared/date.utils';
import DebugToJSON from 'elements/Debug';
import t from 'i18n';
import { FieldCheckbox } from '../FieldCheckbox';
import FieldRadio from '../FieldRadio';
import FieldRadioOption from '../FieldRadio/option';

export default function FieldDate({
  title,
  eventType,
  setEventType,
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart
}) {
  const [showHideMenu, setHideMenu] = useState(false);


  // eventStart
  // eventEnd
  // when
   /*
  recurrent:
   when = {
    type: 'recurrent'
    data: {
      frequency: '1m', // '1w'
    }
   }
  
   multidate = {
    type: 'multidate' // start and endDate define the dates..
   }

   once = {
    type: 'once' // only start date
   }
  */
  let closeMenu = () => {
    setHideMenu(false);
  };

  // https://www.npmjs.com/package/react-time-picker
  return (
    <>
      <div className="form__field">
        <ShowDate eventStart={eventStart} eventEnd={eventEnd} eventType={eventType} title={title} />
        <div
          className="btn"
          onClick={() => setHideMenu(!showHideMenu)}
        >
          {t('button.changeDateLabel')}
        </div>
      </div>
      {showHideMenu && (
        <Picker
          closeAction={closeMenu}
          headerText={t('pickerDate.headerText')}
        >
          <EventType
            name="type"
            label={t('calendar.typePicker')}
            onChange={(value) => setEventType(value)}
          />
          {eventType == DateTypes.ONCE && (
            // <>
            <PickerSpecificDate
              eventStart={eventStart}
              eventEnd={eventEnd}
              setEventEnd={setEventEnd}
              setEventStart={setEventStart}
              onChange={(datetime) => {}}
              closeMenu={closeMenu}
            ></PickerSpecificDate>
            // </>
          )}
          {eventType == DateTypes.MULTIPLE && <></>}
          {eventType == DateTypes.RECURRENT && <></>}
        </Picker>
      )}
    </>
  );
}

const EventType = React.forwardRef(
  ({ name, onChange, onBlur, label, explain }) => {
    const ref = useRef();
    const eventTypes = [
      { label: 'Once', type: DateTypes.ONCE },
      { label: 'Multiple', type: DateTypes.MULTIPLE },
      { label: 'recurrent', type: DateTypes.RECURRENT },
    ];
    return (
      <>
        <FieldRadio label={label} explain={explain}>
          {eventTypes.map((eventType, idx) => (
            <div key={idx}>
              <FieldRadioOption
                onChange={(value) => onChange(eventType.type)}
                onBlur={onBlur}
                name={name}
                ref={ref}
                value={eventType.type}
                key={idx}
              >
                <div className="btn-filter__icon"></div>
                <div className="btn-with-icon__text">
                  {eventType.label}
                </div>
              </FieldRadioOption>
            </div>
          ))}
        </FieldRadio>
      </>
    );
  },
);

export function ShowWhen({ when }) {
  const options = JSON.parse(when);
  return (
    <></>
    //   {(
    //     <ShowDate
    //       dates={options?.dates}
    //       dateType={options?.type}
    //       title={t('calendarAlways.label')}
    //     />
    //   )}
    // </>
  );
}
export function ShowDate({ eventStart, eventEnd, eventType, title }) {
  return (
    <div className="card-button__date">
      {(!eventType) && <>{title}</>}
      {/* {dateType == DateTypes.ALWAYS_ON && (
        <>{t('calendarAlways.label')}</>
      )} */}
      {(eventType == DateTypes.ONCE && eventStart) && (
        <>
          {`${readableDate(eventStart)} From: ${readableTime(eventStart)} Until: ${readableTime(eventEnd)}`}
        </>
      )}
      {eventType == DateTypes.MULTIPLE && <>multiple</>}
      {eventType == DateTypes.RECURRENT && <>recurrent</>}
    </div>
  );
}
