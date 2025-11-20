import { useState } from 'react';
import ShareBulletinForm from './bulletin';
import t from 'i18n';
import { ShareEmbbedForm } from './embbed';
import { IoCodeOutline, IoLocateOutline, IoLogoRss, IoLogoWebComponent, IoPersonAddOutline, IoPrintOutline, IoShare } from 'react-icons/io5';
import { store, useGlobalStore } from 'state';
import { GlobalState } from 'state';
import ShareInvitationsForm from './invitations';
import { ButtonForPopup } from 'components/popup/ButtonToPopup';
import Accordion from 'elements/Accordion';
import { alertService } from 'services/Alert';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import { getShareLink } from 'shared/sys.helper';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import { isAdmin } from 'state/Users';
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

  const userLoggedIn = useGlobalStore(
    (state: GlobalState) => state.sessionUser,
  );
  return (
    <>
      <div className="form__section">
        <div className="form__section-title">
          {t('share.invitePeople')}
        </div>
        <div className="form__field">
 
              <div className="form__explain">
                {t('share.invitePeopleExplain')}
              </div>
              <ShareInviteButton/>
        </div>
        {isAdmin(userLoggedIn) &&
          <div className="form__field">
            <Accordion icon={<IoPrintOutline/>} title={t('share.advancedInviteOptions')} >
              <ShareInvitationsForm />
            </Accordion>
          </div>
       }  
      </div>
      <div className="form__section">

        <div className="form__section-title">
          {t('share.shareContent')}
        </div>
       
          <div className="form__field">
              <div className="form__explain">
                {t('share.shareTypeExplain')}
              </div>
              {userLoggedIn && 
                <Accordion icon={<IoPrintOutline/>} title={t('share.optionBulletin')} >
                  <ShareBulletinForm />
                </Accordion>
              }
            <Accordion icon={<IoCodeOutline/>}  title={t('share.optionIframe')} >
              <ShareEmbbedForm />
            </Accordion>
            <Accordion icon={<IoLogoRss/>} title={t('share.optionRss')} >
              <ShareRssButton/>
            </Accordion>
          </div>
        </div>
      
      
    </>
  );
}

function ShareInviteButton() {
  const onClick = () => {
      store.emit(
      new SetMainPopup(MainPopupPage.SHARE),
    )
    navigator.clipboard.writeText(getShareLink('/Signup'));
    alertService.info(t('share.linkCopied', [getShareLink('/Signup')]))
  }
  return (
    <>
      <div className='form__input form__fake-input' onClick={onClick} >{getShareLink('/Signup')}</div>
      
      <Btn
        btnType={BtnType.corporative}
        contentAlignment={ContentAlignment.center}
        iconLeft={IconType.svg}
        iconLink={<IoPersonAddOutline />}
        caption={t('share.copyLink')}
        onClick={onClick}
      />
    </>
    
  )
}

function ShareRssButton() {
  const onClick = () => {
      store.emit(
      new SetMainPopup(MainPopupPage.SHARE),
    )
    navigator.clipboard.writeText(getShareLink('/rss'));
    alertService.info(t('share.linkCopied', [getShareLink('/rss')]))
  }
  return (
    <>
      <div className='form__input form__fake-input' onClick={onClick} >{getShareLink('/rss')}</div>
      
      <Btn
        btnType={BtnType.corporative}
        contentAlignment={ContentAlignment.center}
        iconLeft={IconType.svg}
        iconLink={<IoLogoRss />}
        caption={t('share.copyLink')}
        onClick={onClick}
      />
    </>
    
  )
}
