import Popup from 'components/popup/Popup';
import Btn from 'elements/Btn';
import { DropdownField } from 'elements/Dropdown/Dropdown';
import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useEffect} from 'react';
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
    { value: 60 * 30, name: t('invite.30min') },
    { value: 60 * 60, name: t('invite.1hr') },
    { value: 60 * 60 * 6, name: t('invite.6hr') },
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
    }
    store.emit(new CreateInvite(invitation));
  };

  const isExpired = (date: Date) => 
  {
    return new Date(date) < new Date();
  }
  return (
    <>
      {loggedInUser && (
        <>
          <Popup title="Invites profile" linkFwd="/HomeInfo">
            <Form
              onSubmit={handleSubmit(onSubmit)}
              classNameExtra="login"
            >
              <div className="login__form">
                Invite people, manage and share links with other
                people to allow them to access your network
                <div className="form__inputs-wrapper"></div>
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
                
                {/* <FieldCheckbox
                  name="followMe"
                  checked={watch('followMe')}
                  text={t('invite.followMe')}
                  {...register('followMe')}
                /> */}
                <Btn
                  caption="Generate new invitation link"
                  submit={true}
                ></Btn>
              </div>
            </Form>
            <hr />
            List Link | Usages | expires | deactivate Link (copy){' '}
            <br />
            {invites.map(
              ({ usage, maximumUsage, expiration, id }) => {
                if( isExpired(expiration)){
                  return (<></>)
                }
                return (
                  <div key={id}>
                    <a
                      className=""
                      onClick={() => {
                        navigator.clipboard.writeText(
                          getShareLink('/Signup/Invite/' + id),
                        );
                      }}
                    >
                      {t('invite.copy')}
                    </a>
                    |
                    {maximumUsage > 0 ? (
                      <>
                        {usage} / {maximumUsage}{' '}
                      </>
                    ) : (
                      <> {t('invite.nolimit')}</>
                    )}
                    | {expirationTime(expiration)}
                    <br />
                  </div>
                );
              },
            )}
          </Popup>
        </>
      )}
    </>
  );
}
