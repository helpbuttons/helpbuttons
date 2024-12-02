import { useState } from 'react';
import { LinkProfile } from '../LinkProfile';
import { GetAdminPhone } from 'state/Users';
import { GlobalState, store } from 'state';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import { IoCallOutline } from 'react-icons/io5';
import t from 'i18n';
import { useGlobalStore } from 'state';
import { alertService } from 'services/Alert';
import router from 'next/router';

export function LinkAdmins() {
  const selectedNetwork = useGlobalStore(
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  const sendMessage = (raw) => {
    // store.emit(new SendMessageToAdmins(raw, () => {
    //   alertService.info('Message sent to the admins of the network')
    //   router.push('/HomeInfo')
    // }))
  };

  return (
    <>
      {selectedNetwork &&
        selectedNetwork.administrators &&
        selectedNetwork.administrators.map((user, idx) => {
          if (user) {
            const extra = <ShowPhone user={user} />;
            return (
              <LinkProfile
                key={user.id}
                username={user.username}
                avatar={user.avatar}
                name={user.name}
                extra={extra}
                // onClick=(sendMessage)
              ></LinkProfile>
            );
          }
          return <></>;
        })}
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
            setPhone(() => phone);
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
            <div className="card-button__phone-section">
              <Btn
                btnType={BtnType.filterCorp}
                contentAlignment={ContentAlignment.center}
                iconLeft={IconType.circle}
                iconLink={<IoCallOutline />}
                submit={true}
                onClick={() => onCallClick()}
              />
              <div className="">{phone}</div>
            </div>
          )}
        </>
      )}
    </>
  );
}
