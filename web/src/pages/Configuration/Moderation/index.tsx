import Popup from 'components/popup/Popup';
import { LinkProfile } from 'components/user/LinkProfile';
import t from 'i18n';
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
        linkBack="/Profile"
      >
        <h2>Administrators</h2>
        {moderationList !== null &&
          moderationList.administrators.map((user) => {
            return (
              <LinkProfile
                username={user.username}
                avatar={user.avatar}
                name={user.name}
              ></LinkProfile>
            );
          })}
        <h2>Blocked</h2>
        {moderationList !== null &&
          moderationList.blocked.map((user) => {
            return (
              <LinkProfile
                username={user.username}
                avatar={user.avatar}
                name={user.name}
              ></LinkProfile>
            );
          })}
      </Popup>
    </>
  );
}

