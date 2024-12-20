import { useEffect, useState } from 'react';
import ShareBulletinForm from './bulletin';
import t from 'i18n';
import { DropdownField } from 'elements/Dropdown/Dropdown';
import { ShareEmbbedForm } from './embbed';
import { IoShare } from 'react-icons/io5';
import { useGlobalStore } from 'state';
import { GlobalState } from 'state';
import ShareInvitationsForm from './invitations';
import { ButtonForPopup } from 'components/popup/ButtonToPopup';
import Popup from 'components/popup/Popup';
export function ShareButton({onClick})
{
  return <ButtonForPopup buttonIcon={<IoShare/>} buttonCaption={t('homeinfo.share')} onClick={onClick}/>
}
export function ShareForm({}) {
  enum shareOptions {
    rss = 'rss',
    ics = 'ics',
    iframe = 'iframe',
    ap = 'ap',
    bulletin = 'bulletin',
    invitations = 'invitations',
  }
  const [shareOptionSelected, setShareOptionSelected] =
    useState<shareOptions>(shareOptions.iframe);

  const renderShareForm = () => {
    switch (shareOptionSelected) {
      case shareOptions.bulletin:
        return <ShareBulletinForm />;
      case shareOptions.iframe:
        return <ShareEmbbedForm />;
      case shareOptions.invitations:
        return <ShareInvitationsForm />;
    }
  };

  const userLoggedIn = useGlobalStore(
    (state: GlobalState) => state.sessionUser,
  );
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
      name: t('share.optionIframe'),
    },
    // {
    //   value: shareOptions.ap,
    //   name: 'Fediverse',
    // },
  ]);
  
  useEffect(() => {
    if (userLoggedIn) {
      setOptions((prevOptions) => {
        const bulletinOptionExists = prevOptions.find(
          (opt) => opt.value == shareOptions.bulletin,
        );
        if (!bulletinOptionExists) {
          return [
            ...prevOptions,
            {
              value: shareOptions.bulletin,
              name: t('share.optionBulletin'),
            },
            {
              value: shareOptions.invitations,
              name: t('share.optionInvitations'),
            },
          ];
        }
        return prevOptions;
      });
    }
  }, [userLoggedIn]);

  return (
    <>
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
    </>
  );
}
