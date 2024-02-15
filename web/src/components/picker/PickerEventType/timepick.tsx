import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import { useState } from "react";
import { IoTimeOutline } from "react-icons/io5";
import { Picker } from "../Picker";
import TimeKeeper from "react-timekeeper";
import t from "i18n";

export function TimePick({ dateTime, setDateTime, label }) {
    const [showFromTime, setShowFromTime] = useState(false);
  
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
  
    return (
      <>
        <Btn
          caption={label}
          btnType={BtnType.splitIcon}
          iconLink={<IoTimeOutline />}
          iconLeft={IconType.circle}
          contentAlignment={ContentAlignment.center}
          onClick={() =>
            setShowFromTime((show) => {
              return !show;
            })
          }
        />
        {showFromTime && (
          <Picker
            closeAction={() => {
              setShowFromTime(false);
            }}
            headerText={t('eventType.headerText')}
          >
            <div className="picker__row">
              <TimeKeeper
                time={ time}
                onChange={(newTime) => {
                  setNewTime(newTime.formatted24);
                }}
                onDoneClick={() => {
                  setShowFromTime(() => false);
                }}
                hour24Mode
                switchToMinuteOnHourSelect
              />
            </div>
          </Picker>
        )}
      </>
    );
  }
  