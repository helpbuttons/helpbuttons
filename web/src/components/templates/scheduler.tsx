import t from "i18n";
import { IoSync, IoTimeOutline } from "react-icons/io5";
import { CustomTemplate } from ".";
import FieldText from "elements/Fields/FieldText";
import { Dropdown } from "elements/Dropdown/Dropdown";
import { calculateExpiringDate, calculateRewnedDate, schedulerPeriodicy, SchedulerUnity } from "shared/types/scheduler.type";
import { readableTimeLeftToDate } from "shared/date.utils";
import { CustomFields } from "shared/types/customFields.type";
import { useButtonTypes } from "shared/buttonTypes";

export const schedulerTemplate: CustomTemplate = {
    icon: <IoSync />,
    explain: t('customTemplates.schedulerExplain'),
    text: t('customTemplates.schedulerText'),
    name: CustomFields.Scheduler,
    configurationForm: ConfigurationFormScheduler,
    templateField: FieldScheduler,
    fieldView: FieldSchedulerView
}

export function FieldSchedulerView({button, isList, isButtonOwner}){

    return <div className={isList ? 'card-button-list__date' : 'card-button__date'}>
        {isButtonOwner && <FieldSchedulerViewOwner expirationDate={button.expirationDate} type={button.type}/> }
        {!isButtonOwner && <FieldSchedulerViewUser expirationDate={button.expirationDate} type={button.type}/>}
        
           </div>
}


export function FieldSchedulerViewUser({expirationDate,type}) {
    const now = new Date()

    const buttonTypes = useButtonTypes();
    const customFields = buttonTypes.find((_type) => _type.name == type)?.customFields.find((t) => t.type == CustomFields.Scheduler)

    const renewdate = customFields?.unity ? calculateRewnedDate(customFields.unity, customFields.value, new Date(expirationDate)) : null
    return <>{expirationDate &&
        (new Date(expirationDate) > now) ? <>
        <IoSync />
        {t('customTemplates.renewed')} {readableTimeLeftToDate(renewdate)}
                            </> : 
                            <><IoSync />{t('button.expiredLabel')}</>
        }
        </>
}

export function FieldSchedulerViewOwner({expirationDate, type}) {
    const now = new Date()
    return <>{expirationDate &&
            (new Date(expirationDate) > now) ? <>
            <IoTimeOutline />

            {t('customTemplates.willExpire')} {readableTimeLeftToDate(expirationDate)}
                            </> : 
                            <><IoSync />{t('button.expiredLabel')}</>
    }
                            </>
}
export function FieldScheduler({ customFields }) {
    const customField = customFields.find((_cstm) => _cstm.type == schedulerTemplate.name)
    const expirationDate = calculateExpiringDate(customField.unity, parseInt(customField.value))

    const periodicy = schedulerPeriodicy(customField.unity, customField.value)
    return <>
            <label className="form__label">{t('customTemplates.schedulerLabelForm', [ readableTimeLeftToDate(expirationDate)])}</label>
            <p className="form__explain">
                {t('customTemplates.schedulerExplainForm', [periodicy])}
            </p>
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
    const customFieldValues = editingValue?.customFields ? editingValue.customFields.find((custom) => custom.type == schedulerTemplate.name) : []
    return <div className="form__field panel">
        <FieldText label={t('customTemplates.schedulerLabelAdminForm')} defaultValue={customFieldValues?.value} name={"value"} onChange={(event) => saveValue(event.target.value)} explain={t('customTemplates.schedulerExplainAdminForm')} />
        <Dropdown defaultSelected={customFieldValues?.unity} options={scheduleUnityOptions} onChange={(value) => saveUnity(value)} />
    </div>
}