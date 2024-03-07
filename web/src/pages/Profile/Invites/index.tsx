import Popup from 'components/popup/Popup';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import { DropdownField } from 'elements/Dropdown/Dropdown';
import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Form from 'elements/Form';

import { Invite } from 'shared/entities/invite.entity';
import { User } from 'shared/entities/user.entity';
import { CreateInvite, FindInvites } from 'state/Users';
import { useStore } from 'store/Store';
import {
  readableDate,
  readableTimeLeftToDate,
} from 'shared/date.utils';
import { getShareLink } from 'shared/sys.helper';
import { alertService } from 'services/Alert';
import router from 'next/router';

export default function Invites() {
  const invites: Invite[] = useStore(
    store,
    (state: GlobalState) => state.invites,
  );
  const loggedInUser: User = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
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
      maximumUsage: parseInt(data.maximumUsage),
      expirationTimeInSeconds: parseInt(data.expirationTimeInSeconds),
      followMe: data.followMe,
    };
    store.emit(new CreateInvite(invitation));
  };

  const isExpired = (date: Date) => {
    return new Date(date) < new Date();
  };

  const captionInvite = ({ usage, maximumUsage, expiration, id }) => {
    return (
      <>
        {maximumUsage > 0 ? (
          <>
            {usage} / {maximumUsage}{' '}
          </>
        ) : (
          <> {t('invite.nolimit')} </> 
        )}
        , {t('invite.expiresIn')} {expirationTime(expiration)}
      </>
    );
  };

  const getInvitationLink = (code) => {
    return '/Signup/Invite/' + code;

  }
  const copyInvitation = (invitation) => {
    const link = getInvitationLink(invitation.id);
    navigator.clipboard.writeText(
      getShareLink(link),
    );
    alertService.info(t('invite.copied', [link]))
  }
  return (
    <>
      {loggedInUser && (
        <>
        {/* <Popup title={t('configuration.title')} LinkFwd="/Profile">
        <Form
        classNameExtra="configuration"
        onSubmit={handleSubmit(onSubmit)}
      > */}
        {/* <div className="form__inputs-wrapper">
          <div className="form__field">
            <p className="form__explain">{description}</p>
            <p>
              <b>{getUrlOrigin()}</b>
            </p>
          </div>
          </div>
          </Form>
        </Popup> */}
          <Popup title={t('invite.title')} linkBack={() => router.back()}>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              classNameExtra="invite"
            >
              <div className="invite__form">
               
                <p className="form__explain">{t('invite.description')}</p>
                <div className="form__inputs-wrapper">
                <DropdownField
                  options={maximumUsageTimesOptions}
                  defaultSelected={'nolimit'}
                  onChange={(value) =>
                    setValue('maximumUsage', value)
                  }
                  label={t('invite.maximumUsageTimes')}
                />
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
                  <div
                    key={idx}
                  >
                    {(!isExpired(invitation.expiration) || !invitation.expiration) && (
                      <div className='form__list-item--button-type-field' key={idx}>
                      {captionInvite(invitation)}
                      
                      <Btn
                        btnType={BtnType.filter}
                        iconLeft={IconType.color}
                        contentAlignment={ContentAlignment.left}
                        caption={t('invite.clickToCopy')}
                        onClick={() => copyInvitation(invitation)}
                      />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </Popup>
        </>
      )}
    </>
  );
}
