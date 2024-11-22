import { DropdownField } from "elements/Dropdown/Dropdown"
import t from "i18n"
import { getLocale } from "shared/sys.helper"

export const FieldLanguagePick = ({ onChange, explain, defaultValue }) => {

  return (<>
    {defaultValue &&
      <DropdownField
        options={[
          { value: 'en', name: 'English' },
          { value: 'es', name: 'Español' },
          { value: 'pt', name: 'Português' },
          { value: 'eu', name: 'Euskera' },
          { value: 'cat', name: 'Catalá' },
        ]}
        explain={explain}
        defaultSelected={defaultValue}
        onChange={onChange}
        label={t('user.pickLanguageLabel')}
      />
    }</>
  )
}