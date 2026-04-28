import { TimeRangePicker } from './timepick';
import CalendarHb from 'components/calendar';
import { checkIfDateHitsEvent, mergeDateTime } from 'shared/date.utils';
import { useEffect, useState } from 'react';
import { GlobalState, useGlobalStore } from 'state';
import ContentList from 'components/list/ContentList';
import { useButtonTypes } from 'shared/buttonTypes';

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

export function OverlappingEvents({buttons}){
  const buttonTypes = useButtonTypes()
  return <>
          {buttons.length > 0 && <ContentList buttons={buttons} buttonTypes={buttonTypes} hideEmptyListWarning={true}/>}</>
}