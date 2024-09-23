import PickerField from 'components/picker/PickerField';
import { useState } from 'react';
import { useShowPopup } from 'shared/custom.hooks';
import ShareBulletinForm from './bulletin';
import t from 'i18n';
import { DropdownField } from 'elements/Dropdown/Dropdown';
import { ShareEmbbedForm } from './embbed';

export function SharePopup({}) {
  enum shareOptions {
    rss = 'rss',
    ics = 'ics',
    iframe = 'iframe',
    ap = 'ap',
    bulletin = 'bulletin',
  }
  const [popupShowState, openPopup, closePopup] = useShowPopup();
  const [shareOptionSelected, setShareOptionSelected] =
  useState<shareOptions>(shareOptions.iframe);

  const renderShareForm = () => {
    switch (shareOptionSelected) {
      case shareOptions.bulletin:
        return <ShareBulletinForm />;
      case shareOptions.iframe:
        return <ShareEmbbedForm/>;
    }
  }

  return (
    <>
      <div>
        <PickerField
          btnLabel={t('share.showSharePopup')}
          label={t('share.showSharePopup')}
          headerText={t('share.showSharePopup')}
          showPopup={popupShowState}
          openPopup={openPopup}
          closePopup={closePopup}
        >
          <div className="form__field">
            <div className="form__label">
              {t('share.shareTypeLabel')}
            </div>
            <div className="form__explain">
              {t('share.shareTypeExplain')}
            </div>
            <DropdownField
              options={[
                // {
                //   value: shareOptions.rss,
                //   name: 'Rss feed',
                // },
                // {
                //   value: shareOptions.ics,
                //   name: 'ICS/ICAL',
                // },
                {
                  value: shareOptions.iframe,
                  name: 'embbedable',
                },
                {
                  value: shareOptions.bulletin,
                  name: 'bulletin',
                },
                // {
                //   value: shareOptions.ap,
                //   name: 'Fediverse',
                // },
              ]}
              onChange={(value) =>
                setShareOptionSelected(() => value)
              }
              value={shareOptionSelected}
            />
          </div>
          {renderShareForm()}
        </PickerField>
      </div>
    </>
  );
}
