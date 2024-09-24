import PickerField from 'components/picker/PickerField';
import { useEffect, useState } from 'react';
import { useShowPopup } from 'shared/custom.hooks';
import ShareBulletinForm from './bulletin';
import t from 'i18n';
import { DropdownField } from 'elements/Dropdown/Dropdown';
import { ShareEmbbedForm } from './embbed';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import { IoShare } from 'react-icons/io5';
import { useGlobalStore } from 'store/Store';
import { GlobalState } from 'pages';

export function ShareButtonPopup({}) {
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

  const userLoggedIn = useGlobalStore((state: GlobalState) => state.loggedInUser)
  const [options, setOptions] = useState([
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
    // {
    //   value: shareOptions.ap,
    //   name: 'Fediverse',
    // },
  ])

  useEffect(() => {
    if(userLoggedIn)
    {
      setOptions((prevOptions) => [...prevOptions, {
        value: shareOptions.bulletin,
        name: 'bulletin',
      }])
    }
  }, [userLoggedIn])

  

  return (
    <>
      <div>
        <PickerField
          btnLabel={t('share.showSharePopup')}
          label={null}
          headerText={t('share.showSharePopup')}
          showPopup={popupShowState}
          openPopup={openPopup}
          closePopup={closePopup}
          button={<Btn
            btnType={BtnType.filterCorp}
            iconLink={<IoShare />}
            caption={t('homeinfo.share')}
            iconLeft={IconType.circle}
            contentAlignment={ContentAlignment.center}
            onClick={() => openPopup()}
          />}
        >
          <div className="form__field">
            <div className="form__label">
              {t('share.shareTypeLabel')}
            </div>
            <div className="form__explain">
              {t('share.shareTypeExplain')}
            </div>
            <DropdownField
              options={options}
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
