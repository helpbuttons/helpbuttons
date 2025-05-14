//is the component or element integrated in buttonNewPublish. Right before activate button. It displays the current selected date and a button to chang it, that ddisplays a picker with the date options for the net that's selecte
import React, {  useState } from 'react';
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
import { IoTimeOutline } from 'react-icons/io5';

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
  validationError
}) {
  const [showPopup, setShowPopup] =  useState(true)

  const closePopup = () => {setShowPopup(() => false)}
  const openPopup = () => {setShowPopup(() => true)}
  const discardDates = () => {
    _setEventStart(() => eventStart)
    _setEventEnd(() => eventEnd)
    closePopup()
  }
  const saveNewDates = () => {
    setEventStart(_eventStart)
    setEventEnd(_eventEnd)
    closePopup()
  }
  const [_eventStart, _setEventStart] = useState(eventStart)
  const [_eventEnd, _setEventEnd] = useState(eventEnd)

  const handleChangeToMultipleDates = (newStartTimeDate, newEndTimeDate) => {
    _setEventStart(newStartTimeDate)
    _setEventEnd(newEndTimeDate)
    setEventType(DateTypes.MULTIPLE)
  }
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
      closePopup={discardDates}
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
                  eventStart={_eventStart}
                  eventEnd={_eventEnd}
                  setEventEnd={_setEventEnd}
                  setEventStart={_setEventStart} 
                  handleChangeToMultipleDates={handleChangeToMultipleDates}                  
                ></PickerEventTypeOnceForm>
              )}
              {eventType == DateTypes.MULTIPLE && (
                  <PickerEventTypeMultipleForm
                    eventStart={_eventStart}
                    eventEnd={_eventEnd}
                    setEventEnd={_setEventEnd}
                    setEventStart={_setEventStart}
                  ></PickerEventTypeMultipleForm>
              )}
              {eventType == DateTypes.RECURRENT && (
                <PickerEventTypeRecurrentForm
                  rrule={loadRrules(eventData)}
                  setRrule={(rrule) => {
                    setEventData(rrule); 
                    _setEventStart(new Date(rrule.dtstart)); 
                    _setEventEnd(new Date(rrule.until))}}
                />
              )}
                <Btn
                  btnType={BtnType.submit}
                  caption={t('common.save')}
                  contentAlignment={ContentAlignment.center}
                  onClick={saveNewDates}
                  disabled={!_eventStart || !_eventEnd}
                />
            </div>
    </PickerField>
    <FieldError validationError={validationError} />
    </>
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
