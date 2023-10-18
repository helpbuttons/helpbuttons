import { LoadabledComponent } from 'components/loading';
import Popup from 'components/popup/Popup';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import t from 'i18n';
import Link from 'next/link';
import { store } from 'pages';
import { useEffect, useState } from 'react';
import { ModerationList } from 'state/Users';

export default function Moderation() {
  const [moderationList, setModerationList] = useState(null);
  useEffect(() => {
    if (moderationList === null) {
      store.emit(
        new ModerationList((moderationList) =>
          setModerationList(moderationList),
        ),
      );
    }
  }, [moderationList]);
  return (
    <>
      <Popup
        title={t('configuration.moderationList')}
        linkFwd="/Profile"
      >
        <h2>Administrators</h2>
        {moderationList !== null &&
          moderationList.administrators.map((user) => {
            return (
              <UserCard
                username={user.username}
                avatar={user.avatar}
                name={user.name}
              ></UserCard>
            );
          })}
        <h2>Blocked</h2>
        {moderationList !== null &&
          moderationList.blocked.map((user) => {
            return (
              <UserCard
                username={user.username}
                avatar={user.avatar}
                name={user.name}
              ></UserCard>
            );
          })}
      </Popup>
    </>
  );
}
function UserCard({ username, avatar, name }) {
  return (
    <div className="form__list--button-type-field">
      <div className="card-button__header">
        <div className="card-button__avatar">
          <div className="avatar-big">
            <Link href={`/Profile/${username}`}>
              <ImageWrapper
                imageType={ImageType.avatarBig}
                src={avatar}
                alt="Avatar"
              />
            </Link>
          </div>
        </div>

        <div className="card-button__info">
          <div className="card-button__name">
            <Link href={`/Profile/${username}`}>
              {name}{' '}
              <span className="card-button__username">
                @{username}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
