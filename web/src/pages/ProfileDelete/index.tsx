import Popup from 'components/popup/Popup';
import Btn, { IconType } from 'elements/Btn';
import t from 'i18n';
import Link from 'next/link';
import router from 'next/router';
import { GlobalState, store } from 'pages';
import { IoTrashBinOutline } from 'react-icons/io5';
import { User } from 'shared/entities/user.entity';
import { DeleteProfile } from 'state/Users';
import { useStore } from 'store/Store';

export default function ProfileDelete() {
  const loggedInUser: User = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  return (
    <Popup linkFwd="/" title={t('user.profileView')}>
      <div className="card-profile__actions">
        <Link
          onClick={() => {
            store.emit(new DeleteProfile());
            router.push({
              pathname: '/HomeInfo'
            });
          }}
          href="#"
        >
          <Btn
            iconLeft={IconType.svg}
            iconLink={<IoTrashBinOutline />}
            caption={t('user.confirmDeleting')}
          />
        </Link>
      </div>
    </Popup>
  );
}
