import t from "i18n";
import { IoSync } from "react-icons/io5";
import { CustomTemplate } from ".";
import FieldError from "elements/Fields/FieldError";
import FieldText from "elements/Fields/FieldText";
import { Dropdown } from "elements/Dropdown/Dropdown";
import { calculateExpiringDate, SchedulerUnity } from "shared/types/scheduler.type";
import { readableDateTime, readableTimeLeftToDate } from "shared/date.utils";

export const schedulerTemplate: CustomTemplate = {
    icon: <IoSync />,
    explain: t('customTemplates.schedulerExplain'),
    text: t('customTemplates.schedulerText'),
    name: 'scheduler',
    configurationForm: ConfigurationFormScheduler,
    templateField: FieldScheduler,
    fieldView: FieldSchedulerView
}

export function FieldSchedulerView({button}){
    return <>{button.expirationDate ? `${t('customTemplates.willExpire')} ${readableTimeLeftToDate(button?.expirationDate)}` : ''}</>
}

export function FieldScheduler({ customFields }) {
    const customField = customFields.find((_cstm) => _cstm.type == schedulerTemplate.name)
    const expirationDate = calculateExpiringDate(customField.unity, parseInt(customField.value))
    return <>
            <label className="form__label">{t('customTemplates.schedulerLabelForm')}</label>
            <p className="form__explain">
                {t('customTemplates.schedulerExplainForm')}
            </p>
            <div>{readableDateTime(expirationDate)}</div>
           </>
}
export function ConfigurationFormScheduler({ setEditing, editingValue
}) {
    const scheduleUnityOptions = [
        {value: '', name: ''},
        { value: SchedulerUnity.HOUR, name: t('customTemplates.hour') },
        { value: SchedulerUnity.DAY, name: t('customTemplates.day') },
        { value: SchedulerUnity.MONTH, name: t('customTemplates.month') },
    ]
    
    const saveUnity = (value) => {
        setEditing({
            customFields: editingValue.customFields.map((_field, idx) => {
                if (_field.type == schedulerTemplate.name) {
                    return { ..._field, unity: value }
                }
                return _field
            })
        }
        )
    }
    const saveValue = (value) => {
        setEditing({
            customFields: editingValue.customFields.map((_field, idx) => {
                if (_field.type == schedulerTemplate.name) {
                    return { ..._field, value: value }
                }
                return _field
            })
        }
        )
    }
    const customFieldValues = editingValue.customFields.find((custom) => custom.type == schedulerTemplate.name)
    return <>
        <FieldText label={t('customTemplates.schedulerLabelAdminForm')} defaultValue={customFieldValues?.value} name={"value"} onChange={(event) => saveValue(event.target.value)} explain={t('customTemplates.schedulerExplainAdminForm')} />
        <Dropdown defaultSelected={customFieldValues?.unity} options={scheduleUnityOptions} onChange={(value) => saveUnity(value)} />
    </>
}