import Btn, { BtnType, ContentAlignment } from "elements/Btn";
import Form from "elements/Form";
import t from "i18n";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { store } from "state";
import { MainPopupPage, SetInvitationPopup, SetMainPopup } from "state/HomeInfo";
import QRCode from 'qrcode';
import { getShareLink } from "shared/sys.helper";
import { getInvitationLink } from "pages/Profile/Invites";
import { RequestGuestInvite } from "state/Profile";


enum steps {
  REQUEST_CODE,
  SUCCESS
}
export function SignupAsGuestForm() {
  const [code, setCode] = useState(null)
  const [qrCodeData, setQrCodeData] = useState(null);
  const [invitationLink, setInvitationLink] = useState(null);
  const [step, setStep] = useState<steps>(steps.REQUEST_CODE)

  const {
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setStep(steps.SUCCESS)
  };

  const requestNewGuestCode = () => {
    store.emit(new RequestGuestInvite((code) => {
      setCode(code)
      const link = getInvitationLink(code);
      setInvitationLink(getShareLink(link))
      QRCode.toDataURL(getShareLink(link), function (err, dataUrl) {
        setQrCodeData(() => dataUrl);
      });
      setStep(steps.SUCCESS)
    }))
  }
  return <>
    <Form onSubmit={handleSubmit(onSubmit)} classNameExtra="login">
      <div className="login__form">
        <div className="form__inputs-wrapper">
          {step == steps.REQUEST_CODE &&
            <>
              <div>{t('user.explainPublishAsGuest')}</div>
              <Btn
                submit={false}
                btnType={BtnType.submit}
                caption={t('user.generateCode')}
                contentAlignment={ContentAlignment.center}
                onClick={() => requestNewGuestCode()}
              />
            </>
          }
          {step == steps.SUCCESS &&
            <>
              <div>{t('user.explainUseGuestCode')}</div>
              {qrCodeData && <><img src={qrCodeData} />{invitationLink}</>}
              <Btn
                submit={false}
                btnType={BtnType.submit}
                caption={t('user.signupGuestDetails')}
                contentAlignment={ContentAlignment.center}
                onClick={() => {
                  store.emit(new SetInvitationPopup(code))
                }}
              />
            </>
          }


        </div>
        <div className="form__btn-wrapper">
          {(step == steps.REQUEST_CODE) &&
            <>
              <div className="popup__link">
                <div onClick={() => store.emit(new SetMainPopup(MainPopupPage.LOGIN))} className={`nav-bottom__link`}>
                  {t('user.loginLink')}
                </div>
              </div>
              <div className="popup__link">
                <div onClick={() => store.emit(new SetMainPopup(MainPopupPage.SIGNUP))} className={`nav-bottom__link`}>
                  {t('user.noAccount')}
                </div>
              </div>
            </>}
        </div></div>
    </Form>
  </>
}
