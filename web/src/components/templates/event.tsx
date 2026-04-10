import t from "i18n";
import { IoCalendar, IoTimeOutline } from "react-icons/io5";
import { CustomTemplate } from ".";
import FieldDate, { ShowDate } from "elements/Fields/FieldDate";

export const eventTemplate : CustomTemplate = {
    icon: <IoCalendar/>,
    explain: t('customTemplates.eventExplain'),
    text: t('customTemplates.eventText'),
    name: 'event',
    templateField: FieldEvent,
    configurationForm: null,
    fieldView: FieldEventView,
}

export function FieldEventView({button}) {
    return <div className='card-button__date'>
            <IoTimeOutline/>
            <div>
            <ShowDate
                eventStart={button.eventStart}
                eventEnd={button.eventEnd}
                eventType={button.eventType}
                title={button.title}
                eventData={button.eventData}
                hideRecurrentDates={true}
            />
            </div>
        </div>
}

export function FieldEvent({ watch, setValue, register, validationError }) {
    return (
        <FieldDate
            eventType={watch('eventType')}
            setEventType={(value) => setValue('eventType', value)}
            eventStart={watch('eventStart')}
            eventEnd={watch('eventEnd')}
            eventData={watch('eventData')}
            setEventData={(value) => setValue('eventData', value)}
            setEventStart={(value) => setValue('eventStart', value)}
            setEventEnd={(value) => {
                setValue('eventEnd', value);
            }}
            title={t('button.whenLabel')}
            register={register}
            validationError={validationError}
        />
    );
}