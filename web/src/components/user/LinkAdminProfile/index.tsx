import { useState } from 'react';
import { LinkProfile } from '../LinkProfile';
import { GetAdminPhone } from 'state/Users';
import { store } from 'pages';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import { IoCallOutline } from 'react-icons/io5';
import t from 'i18n';

export function LinkAdminProfile({ user }) {
  const extra = <ShowPhone user={user} />
  return (
    <>
      <LinkProfile
        key={user.id}
        username={user.username}
        avatar={user.avatar}
        name={user.name}
        extra={extra}
      ></LinkProfile>
      
    </>
  );
}

function ShowPhone({ user }) {
  const [showPhone, toggleShowPhone] = useState(false);
  const [phone, setPhone] = useState(null);
  const onCallClick = () => {
    getPhone();
    window.open('tel:' + phone);
  };
  const onShowPhoneClick = () => {
    getPhone();
    toggleShowPhone(!showPhone);
  };

  const getPhone = () => {
    if (phone == null) {
      store.emit(
        new GetAdminPhone(
          user.id,
          (phone) => {
            setPhone(phone);
          },
          () => {},
        ),
      );
    }
  };

  return (
    <>
      {user?.hasPhone && (
        <>
          {!showPhone && (
            <Btn
              btnType={BtnType.filterCorp}
              contentAlignment={ContentAlignment.center}
              caption={t('button.showPhone')}
              iconLeft={IconType.circle}
              onClick={() => onShowPhoneClick()}
            />
          )}
          {showPhone && (
            <>
              <Btn
                btnType={BtnType.filterCorp}
                contentAlignment={ContentAlignment.center}
                iconLeft={IconType.circle}
                iconLink={<IoCallOutline />}
                submit={true}
                onClick={() => onCallClick()}
              />
              <div className="card-button__rating--phone">
                {phone}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
