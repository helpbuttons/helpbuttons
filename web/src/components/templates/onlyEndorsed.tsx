import { IoLockClosed } from "react-icons/io5";
import { CustomTemplate } from ".";
import { CustomFields } from "shared/types/customFields.type";
import t from "i18n";

export const onlyEndorsedTemplate : CustomTemplate = {
    icon: <IoLockClosed/>,
    explain: 'customFields.onlyEndorsedExplain',
    text: 'customFields.onlyEndorsedText',
    name: CustomFields.OnlyEndorsed,
    templateField: FieldOnlyEndorsed,
    configurationForm: null,
    fieldView: FieldOnlyEndorsed,
}


export function FieldOnlyEndorsed({

  }) {
    
    return (
      <>
        {t('customFields.onlyEndorsedFieldText')}
      </>
    );
  }

export default FieldOnlyEndorsed;