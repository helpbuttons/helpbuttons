//is the component or element integrated in buttonNewPublish. Right before activate button. It displays the current selected date and a button to chang it, that ddisplays a picker with the date options for the net that's selecte
import { Picker } from 'components/picker/Picker';
import React, { useState } from 'react';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import {
  DateTypes,
  readableDateTime,
  readableTime,
} from 'shared/date.utils';
import t from 'i18n';
import FieldRadio from '../FieldRadio';
import FieldRadioOption from '../FieldRadio/option';
import PickerEventTypeOnceForm from 'components/picker/PickerEventType/once';
import PickerEventTypeMultipleForm from 'components/picker/PickerEventType/multiple';
import FieldError from '../FieldError';
import PickerEventTypeRecurrentForm, { loadRrules, recurrentToText } from 'components/picker/PickerEventType/recurrent';
import PickerField from 'components/picker/PickerField';
import { IoLocationOutline, IoTime, IoTimeOutline } from 'react-icons/io5';

export default function FieldDate({
  title,
  eventType,
  setEventType,
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart,
  register,
  setEventData,
  eventData = null,
}) {
  const [showPopup, setShowPopup] =  useState(false)
  const [invalidDates, setInvalidDates] = useState(false);
  
  const datesAreValid = (eventEnd, eventStart) => {
    if (eventEnd?.getTime() < eventStart?.getTime()) {
      return false;
    }
    return true;
  };

  let closeMenu = () => {
    if (datesAreValid(eventEnd, eventStart)) {
      closePopup()
      setInvalidDates(() => false);
    }else{
      setInvalidDates(() => true);
    }
  };

  const closePopup = () => setShowPopup(() => false)
  const openPopup = () => setShowPopup(() => true)

  // https://www.npmjs.com/package/react-time-picker
  return (
    <>
    <PickerField
      showPopup={showPopup}
      explain={t('button.whenExplain')}
      iconLink={<IoTimeOutline/>}
      btnLabel={
          <ShowDate
            eventStart={eventStart}
            eventEnd={eventEnd}
            eventType={eventType}
            eventData={eventData}
            title={title}
        />
      }
      headerText={t('eventType.typePicker')}
      label={t('button.whenLabel')}
      openPopup={openPopup}
      closePopup={closePopup}
    >
      <div className="picker__section">
              <EventType
                name="eventType"
                label={t('eventType.typePicker')}
                value={eventType}
                {...register('eventType')}
              />
              {eventType == DateTypes.ONCE && (
                <PickerEventTypeOnceForm
                  eventStart={eventStart}
                  eventEnd={eventEnd}
                  setEventEnd={setEventEnd}
                  setEventStart={setEventStart}
                  onChange={(datetime) => {}}
                  closeMenu={closeMenu}
                ></PickerEventTypeOnceForm>
              )}
              {eventType == DateTypes.MULTIPLE && (
                  <PickerEventTypeMultipleForm
                    eventStart={eventStart}
                    eventEnd={eventEnd}
                    setEventEnd={setEventEnd}
                    setEventStart={setEventStart}
                    onChange={(datetime) => {}}
                    closeMenu={closeMenu}
                  ></PickerEventTypeMultipleForm>
              )}
              {eventType == DateTypes.RECURRENT && (
                <PickerEventTypeRecurrentForm
                  rrule={loadRrules(eventData)}
                  setRrule={(rrule) => {
                    setEventData(rrule); 
                    setEventStart(new Date(rrule.dtstart)); setEventEnd(new Date(rrule.until))}}
                  closeMenu={closePopup}
                />
              )}
              {invalidDates && 
                <FieldError validationError={{message: t('validation.dates')}} />
              }
              <Btn
                btnType={BtnType.submit}
                caption={t('common.save')}
                contentAlignment={ContentAlignment.center}
                onClick={closeMenu}
              />
            </div>
    </PickerField>
    </>
    
    // <>
    //   <div className="form__field">
    //     <ShowDate
    //       eventStart={eventStart}
    //       eventEnd={eventEnd}
    //       eventType={eventType}
    //       eventData={eventData}
    //       title={title}
    //     />
    //     <div className="btn" onClick={() => setHideMenu(true)}>
    //     </div>
    //   </div>
    //   {showHideMenu && (
        
    //     <Picker
    //       closeAction={closeMenu}
    //       headerText={t('eventType.headerText')}
    //     >
    //         <div className="picker__section">
    //           <EventType
    //             name="eventType"
    //             label={t('eventType.typePicker')}
    //             value={eventType}
    //             {...register('eventType')}
    //           />
    //           {eventType == DateTypes.ONCE && (
    //             <PickerEventTypeOnceForm
    //               eventStart={eventStart}
    //               eventEnd={eventEnd}
    //               setEventEnd={setEventEnd}
    //               setEventStart={setEventStart}
    //               onChange={(datetime) => {}}
    //               closeMenu={closeMenu}
    //             ></PickerEventTypeOnceForm>
    //           )}
    //           {eventType == DateTypes.MULTIPLE && (
    //               <PickerEventTypeMultipleForm
    //                 eventStart={eventStart}
    //                 eventEnd={eventEnd}
    //                 setEventEnd={setEventEnd}
    //                 setEventStart={setEventStart}
    //                 onChange={(datetime) => {}}
    //                 closeMenu={closeMenu}
    //               ></PickerEventTypeMultipleForm>
    //           )}
    //           {eventType == DateTypes.RECURRENT && (
    //             <PickerEventTypeRecurrentForm
    //               rrule={loadRrules(eventData)}
    //               setRrule={(rrule) => {
    //                 setEventData(rrule); 
    //                 setEventStart(new Date(rrule.dtstart)); setEventEnd(new Date(rrule.until))}}
    //               closeMenu={closeMenu}
    //             />
    //           )}
    //           {invalidDates && 
    //             <FieldError validationError={{message: 'invalid dates'}} />
    //           }
    //           <Btn
    //             btnType={BtnType.submit}
    //             caption={t('common.save')}
    //             contentAlignment={ContentAlignment.center}
    //             onClick={closeMenu}
    //           />
    //         </div>
    //     </Picker>
    //   )}
    // </>
  );
}

const EventType = React.forwardRef(
  ({ name, onChange, onBlur, label, explain, value }, ref) => {
    const eventTypes = [
      {
        label: t('eventType.once'),
        explain: t('eventType.onceExplain'),
        type: DateTypes.ONCE,
      },
      {
        label: t('eventType.multipleDates'),
        explain: t('eventType.multipleExplain'),
        type: DateTypes.MULTIPLE,
      },
      {
        label: t('eventType.recurring'),
        explain: t('eventType.recurringExplain'),
        type: DateTypes.RECURRENT,
      },
    ];
    return (
      <>
        <FieldRadio label={label} explain={explain}>
          {eventTypes.map((eventType, idx) => (
              <FieldRadioOption
                onChange={(value) => onChange(value)}
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
          ))}
        </FieldRadio>
        <div className='form__explain'>
          {value &&
            eventTypes.find((eventType) => eventType.type == value)
              .explain
          }
        </div>
      </>
    );
  },
);

export function ShowDate({
  eventStart,
  eventEnd,
  eventType,
  title,
  eventData,
  hideRecurrentDates = false,
}) {
  return (
    <>
      {(eventStart || eventData) ? (
        <>
          {readableEventDateTime(
            eventType,
            eventStart,
            eventEnd,
            loadRrules(eventData),
            hideRecurrentDates
          )}
        </>
      ) : <>{title}</>}
    </>
  );
}

export function readableEventDateTime(
  eventType,
  eventStart,
  eventEnd,
  eventData,
  hideRecurrentDates = false
) {
  if (eventType == DateTypes.ONCE && eventStart && eventEnd) {
    return (
      readableDateTime(eventStart) +
      ' - ' +
      readableTime(eventEnd)
    );
  }
  if (eventType == DateTypes.MULTIPLE && eventStart && eventEnd) {
    return (
      t('dates.from') + ' ' + readableDateTime(eventStart) + ' ' +
      t('dates.until') + ' ' +
      readableDateTime(eventEnd)
    );
  }

  if (eventType == DateTypes.RECURRENT) {
    return (recurrentToText(eventData, hideRecurrentDates))
  }
}
