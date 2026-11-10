import { TimeRangePicker } from './timepick';
import CalendarHb from 'components/calendar';
import { checkIfDateHitsEvent, mergeDateTime } from 'shared/date.utils';
import { useEffect, useState } from 'react';
import { GlobalState, useGlobalStore } from 'state';
import { useButtonType, useButtonTypes } from 'shared/buttonTypes';
import { CardButtonCustomFields } from 'components/button/ButtonType/CustomFields/CardButtonCustomFields';
import { useSelectedNetwork } from 'state/Networks';
import { Network } from 'shared/entities/network.entity';
import t from 'i18n';
import { eventTemplate } from 'components/templates/event';

export default function PickerEventTypeOnceForm({
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart
}) {
  const [dateStart, setDateStart] = useState(eventStart ? eventStart : null)

  useEffect(() => {
    if(eventStart){
      setEventStart(() => mergeDateTime(dateStart,eventStart))
    }
    if(eventEnd){
      setEventEnd(() => mergeDateTime(dateStart,eventEnd))
    }
  }, [dateStart])
  
  const setTimeStart = (newTime) => {
    setEventStart(() => mergeDateTime(dateStart,newTime))
  }

  const setTimeEnd = (newTime) => {
    setEventEnd(() => mergeDateTime(dateStart, newTime))
  }
  
  const [buttonsOfDay, setButtonsOfDay] = useState([])
  const eventsMonth = useGlobalStore(    (state: GlobalState) => state.explore.settings.selectedMonth)


  useEffect(() => {
    if (eventsMonth && dateStart) {


      setButtonsOfDay(() => eventsMonth.filter((button) => {
        if (dateStart) {
          if (checkIfDateHitsEvent(
            new Date(button.eventStart),
            new Date(button.eventEnd),
            button.eventData,
            dateStart,
          )) {
            return true;
          }
        }

        return false;
      }))
    }

  }, [dateStart])

  return (
    
    <>
      <div className="picker__row">
        <CalendarHb
          onChange={(newDate) => {
            setDateStart(() => newDate);
          }}
          value={dateStart}
          minDate={new Date()}
        />
      </div>
      <OverlappingEvents buttons={buttonsOfDay}/>
      {(dateStart) && (
        <TimeRangePicker defaultStart={eventStart} defaultEnd={eventEnd} handleChangeEnd={setTimeEnd} handleChangeStart={setTimeStart}/>
      )}
    </>
  );
}

export function OverlappingEvents({ buttons }) {
  const buttonTypes = useButtonTypes()
  return <>
    {buttons.length > 0 && 
          <><span>{t('customFields.eventsOnDay')}</span>
            {buttons.map((button, idx) => {
                return <ButtonEventDay key={idx} buttonTypes={buttonTypes} button={button} />
                 })}
          </>
    }
  </>
}

export function ButtonEventDay({ button, buttonTypes }) {
  const { cssColor, caption, customFields, icon } = useButtonType(button, buttonTypes)
  const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser);
  const selectedNetwork: Network = useSelectedNetwork()
  const onlyDateCustomFields = customFields.filter((customField) => customField.type == eventTemplate.name)
  return <><span>{button.title}</span>
    <CardButtonCustomFields
      customFields={onlyDateCustomFields}
      button={button}
      selectedNetwork={selectedNetwork}
      isList={false}
      isButtonOwner={button?.owner?.id == sessionUser?.id}
    />
  </>
}