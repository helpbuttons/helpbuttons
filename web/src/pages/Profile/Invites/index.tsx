import Popup from 'components/popup/Popup';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import { DropdownField } from 'elements/Dropdown/Dropdown';
import t from 'i18n';
import { GlobalState, store } from 'state';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from 'elements/Form';

import { Invite } from 'shared/entities/invite.entity';
import { User } from 'shared/entities/user.entity';
import { CreateInvite, FindInvites } from 'state/Profile';
import { useStore } from 'state';
import {
  readableDate,
  readableTimeLeftToDate,
} from 'shared/date.utils';
import { getShareLink } from 'shared/sys.helper';
import { alertService } from 'services/Alert';
import router from 'next/router';
import QRCode from 'qrcode';
import dconsole from 'shared/debugger';

export const getInvitationLink = (code) => {
  return '/Signup/Invite/' + code;
};

export default function Invites() {
  const invites: Invite[] = useStore(
    store,
    (state: GlobalState) => state.invites,
  );
  const sessionUser: User = useStore(
    store,
    (state: GlobalState) => state.sessionUser,
  );

  useEffect(() => {
    if (!invites) {
      store.emit(new FindInvites());
    }
  }, [invites]);
  const maximumUsageTimesOptions = [
    { value: '0', name: t('invite.nolimit') },
    { value: '1', name: '1' },
    { value: '10', name: '10' },
    { value: '50', name: '50' },
    { value: '100', name: '100' },
  ];

  const expirationOptions = [
    { value: 0, name: t('invite.never') },
    { value: 60 * 30, name: t('invite.1hr') },
    { value: 60 * 60 * 24, name: t('invite.1day') },
    { value: 60 * 60 * 24 * 7, name: t('invite.1week') },
  ];

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      maximumUsage: 0,
      expirationTimeInSeconds: 0,
      followMe: false,
    },
  });

  const expirationTime = (time) => {
    if (time) {
      return readableTimeLeftToDate(time);
    }
    return t('invite.never');
  };
  const onSubmit = (data) => {
    const invitation = {
      // maximumUsage: parseInt(data.maximumUsage),
      maximumUsage: 1,
      expirationTimeInSeconds: parseInt(data.expirationTimeInSeconds),
      followMe: data.followMe,
    };
    store.emit(new CreateInvite(invitation, () => {dconsole.log('got new invitation')}));
  };

  const isExpired = (date: Date) => {
    return new Date(date) < new Date();
  };

  const captionInvite = ({ usage, maximumUsage, expiration, id }) => {
    return (
      <>
        {/* {maximumUsage > 0 ? (
          <>
            {usage} / {maximumUsage}{' '}
          </>
        ) : (
          <> {t('invite.nolimit')} </>
        )} , */}
        {t('invite.expiresIn')} {expirationTime(expiration)}
      </>
    );
  };

  return (
    <>
      {sessionUser && (
          <Popup
            title={t('invite.title')}
            linkBack={() => router.back()}
          >
            <Form
              onSubmit={handleSubmit(onSubmit)}
              classNameExtra="invite"
            >
              <div className="invite__form">
                <p className="form__explain">
                  {t('invite.description')}
                </p>
                <div className="form__inputs-wrapper">
                  <DropdownField
                    options={expirationOptions}
                    defaultSelected={'never'}
                    onChange={(value) =>
                      setValue('expirationTimeInSeconds', value)
                    }
                    label={t('invite.expiresIn')}
                  />
                  <Btn
                    caption={t('invite.generate')}
                    submit={true}
                  ></Btn>
                </div>
              </div>
            </Form>
            <p>&nbsp;</p>
            <div>
              {invites?.length > 0 &&
                invites.map((invitation, idx) => (
                  <div key={idx}>
                    {(!isExpired(invitation.expiration) ||
                      !invitation.expiration) && (
                      <div
                        className="form__list-item--button-type-field"
                        key={idx}
                      >
                        {captionInvite(invitation)}
                        {invitation.usage > 0 ? <>&nbsp;{t('invite.registered')}</>: <InvitationQrCode url={invitation} />}
                        
                        <img src="" />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </Popup>
      )}
    </>
  );
}

function InvitationQrCode({ url }) {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [invitationLink, setInvitationLink] = useState(null);
  const generateQrCode = (invitation) => {
    const link = getInvitationLink(invitation.id);
    setInvitationLink(getShareLink(link))
    QRCode.toDataURL(getShareLink(link), function (err, dataUrl) {
      setQrCodeData(() => dataUrl);
    });
  };

  return (
    <>
      {qrCodeData && <><img src={qrCodeData} />{invitationLink}</>}
      {!qrCodeData && (
        <Btn
          btnType={BtnType.filter}
          iconLeft={IconType.color}
          contentAlignment={ContentAlignment.left}
          caption={t('invite.generateQr')}
          onClick={() => {
            generateQrCode(url);
          }}
        />
      )}
    </>
  );
}
