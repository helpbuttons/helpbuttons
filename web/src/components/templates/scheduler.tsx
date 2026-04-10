import t from "i18n";
import { IoSync } from "react-icons/io5";
import { CustomTemplate } from ".";
import FieldError from "elements/Fields/FieldError";
import FieldText from "elements/Fields/FieldText";
import { Dropdown } from "elements/Dropdown/Dropdown";

export const schedulerTemplate: CustomTemplate = {
    icon: <IoSync />,
    explain: t('customTemplates.schedulerExplain'),
    text: t('customTemplates.schedulerText'),
    name: 'scheduler',
    configurationForm: ConfigurationFormScheduler,
    templateField: FieldScheduler,
    fieldView: FieldSchedulerView
}

export function FieldSchedulerView({}){
    return <></>
}

export function FieldScheduler({
    value,
    unity,
    validationError
}) {
    return <>
    <label className="form__label">
      {t('customFields.priceLabel', [unity])}
    </label>
    <p className="form__explain">
        {t('customFields.priceExplain')}
      </p>
    
    <FieldError validationError={validationError} />
  </>
}
export function ConfigurationFormScheduler({ setEditing, editingValue
}) {
    const scheduleUnityOptions = [
        {value: '', name: ''},
        { value: 'h', name: 'hour' },
        { value: 'd', name: 'day' },
        { value: 'm', name: 'month' },
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
                    // console.log(_field)
                    return { ..._field, value: value }
                }
                return _field
            })
        }
        )
    }
    const customFieldValues = editingValue.customFields.find((custom) => custom.type == schedulerTemplate.name)
    return <>
        <FieldText label={"Expire buttons after"} defaultValue={customFieldValues?.value} name={"value"} onChange={(event) => saveValue(event.target.value)} />
        <Dropdown defaultSelected={customFieldValues?.unity} options={scheduleUnityOptions} onChange={(value) => saveUnity(value)} />
    </>
}