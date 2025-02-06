import { useState } from 'react';
import { IoTimeOutline } from 'react-icons/io5';
import TimeKeeper from 'react-timekeeper';
import t from 'i18n';
import PickerField from '../PickerField';

export function TimePick({ dateTime, setDateTime, label }) {
  const [pickerTime, setPickerTime] = useState(false);

  const setNewTime = (value) => {
    const newTimeDate = new Date(dateTime);
    const newTime = value.split(':');
    newTimeDate.setHours(newTime[0]);
    newTimeDate.setMinutes(newTime[1]);
    setDateTime(newTimeDate);
  };

  const [time, setTime] = useState(
    dateTime
      ? dateTime.getHours() +
          ':' +
          String(dateTime.getMinutes()).padStart(2, '1')
      : '0:01',
  );
  const hidePickTime = () => setPickerTime(() => false);
  const showPickTime = () => setPickerTime(() => true);

  return (
    <PickerField
      showPopup={pickerTime}
      btnLabel={
        <>
           {label}
        </>
      }
      iconLink={<IoTimeOutline/>}
      headerText={''}
      openPopup={showPickTime}
      closePopup={hidePickTime}
    >
      <div className="picker__row">
        <TimeKeeper
          time={time}
          onChange={(newTime) => {
            setNewTime(newTime.formatted24);
          }}
          onDoneClick={() => hidePickTime()}
          hour24Mode
          switchToMinuteOnHourSelect
        />
      </div>
    </PickerField>
  );
}
