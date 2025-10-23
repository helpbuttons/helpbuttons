import { useEffect, useState } from 'react';
import ShareBulletinForm from './bulletin';
import t from 'i18n';
import { DropdownField } from 'elements/Dropdown/Dropdown';
import { ShareEmbbedForm } from './embbed';
import { IoPersonAddOutline, IoShare } from 'react-icons/io5';
import { store, useGlobalStore } from 'state';
import { GlobalState } from 'state';
import ShareInvitationsForm from './invitations';
import { ButtonForPopup } from 'components/popup/ButtonToPopup';
import Popup from 'components/popup/Popup';
import Accordion from 'elements/Accordion';
import { alertService } from 'services/Alert';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import { getShareLink } from 'shared/sys.helper';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
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
  }
  const [shareOptionSelected, setShareOptionSelected] =
    useState<shareOptions>(shareOptions.iframe);

  const renderShareForm = () => {
    switch (shareOptionSelected) {
      case shareOptions.bulletin:
        return <ShareBulletinForm />;
      case shareOptions.iframe:
        return <ShareEmbbedForm />;
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
              value: shareOptions.rss,
              name: t('share.optionRSS'),
            },
          ];
        }
        return prevOptions;
      });
    }
  }, [userLoggedIn]);

  return (
    <>

        <div className="form__section-title">
          {t('share.invitePeople')}
        </div>
        <div className="form__field">
 
              <div className="form__explain">
                {t('share.invitePeopleExplain')}
              </div>
              <ShareInviteButton/>
        </div>
        <Accordion title={t('share.advancedInviteOptions')} >
            <ShareInvitationsForm />
        </Accordion>

        <div className="form__section-title">
          {t('share.shareContent')}
        </div>
       
          <div className="form__field">
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

function ShareInviteButton() {
  const onClick = () => {
      store.emit(
      new SetMainPopup(MainPopupPage.SHARE),
    )
    navigator.clipboard.writeText(getShareLink('/Signup'));
    alertService.info(t('homeinfo.inviteCopied'))
  }
  return (
    <>
      <div className='form__input form__fake-input' onClick={onClick} >{getShareLink('/Signup')}</div>
      
      <Btn
        btnType={BtnType.corporative}
        contentAlignment={ContentAlignment.center}
        iconLeft={IconType.svg}
        iconLink={<IoPersonAddOutline />}
        extraClass=""
        caption={t('share.copyLink')}
        onClick={onClick}
      />
    </>
    
  )
}
