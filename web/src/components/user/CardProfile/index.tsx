import UserAvatar from '../components';
import t from 'i18n';
import { store, useGlobalStore } from "state";
import { FindPublishedButtons, UpdateRole } from "state/Users";
import { alertService } from "services/Alert";
import router from "next/router";
import { CardSubmenu, CardSubmenuOption } from "components/card/CardSubmenu";
import { Role } from "shared/types/roles";
import ContentList from "components/list/ContentList";
import { useEffect, useState } from "react";
import { useButtonTypes } from "shared/buttonTypes";
import { TagsNav } from 'elements/Fields/FieldTags';

export enum displayListTypes {
  INFO = 'info',
  PUBLISHED = 'published',
  FOLLOWED = 'followed',
  COMMENTED = 'commented'
}

export default function CardProfile({ user }) {

  const sessionUser = useGlobalStore((state) => state.sessionUser)
  const buttonTypes = useButtonTypes();

  const [publishedButtons, setPublishedButtons] = useState(null);
  const loadPublishedButtons = () => {
    if (publishedButtons === null) {
      store.emit(
        new FindPublishedButtons(user?.id, (_userButtons) =>
          setPublishedButtons(() => _userButtons),
        ),
      );
    }
  }
  
  
  const publishedButtonsCount = publishedButtons ? publishedButtons.length.toString() : '...'
  const ownProfile = sessionUser.id == user.id
  const showAdminOptions = sessionUser?.role == Role.admin && !ownProfile
  const showButtonTabs = user.showButtons || ownProfile
  return (
    <>
      <div className="card-profile__container-avatar-content">

        {showAdminOptions &&
          <CardSubmenu extraClass="card-profile__submenu" >
            <ProfileAdminOptions user={user} />
          </CardSubmenu>
        }


        <figure className="card-profile__avatar-container avatar">

          <div className="avatar-big">

            <UserAvatar user={user} />

          </div>


        </figure>

        <div className="card-profile__content">

          <div className="card-profile__avatar-container-name">

            <div className="card-profile__name">{user.name} {user?.role == Role.admin && <div className="card-profile__role hashtag hashtag--blue">Admin</div>} </div>

            <div className="card-profile__username">@{user.username}</div>


          </div>

          {/* {t('user.created_date')}: {readableTimeLeftToDate(user.created_at)} */}

        </div>

      </div>

      {showButtonTabs &&
        <>
          <Tabs defaultIndex={displayListTypes.INFO} onTabClick={console.log}>
            <TabItem label={t('user.profileInfo')} index={displayListTypes.INFO}>
              <PersonalInfo user={user}/>
            </TabItem>
            <TabItem label={t('user.buttonsPublished', [publishedButtonsCount])} onClick={loadPublishedButtons} index={displayListTypes.PUBLISHED}>
              <ContentList
                buttons={publishedButtons}
                buttonTypes={buttonTypes}
                showCreateNew={ownProfile ? true : false}
                isLoading={publishedButtons == null}
                browseMapOnEmpty={false}
              />
            </TabItem>
            {/* <TabItem label={t('user.buttonFollowed', ['2'])} onClick={loadFollowedButtons} index={displayListTypes.FOLLOWED}>
              List of published buttons
            </TabItem> */}
          </Tabs>
        </>
      }
      {!showButtonTabs && <PersonalInfo user={user}/>}

    </>
  );
}

function PersonalInfo({ user }) {
  return (
    <div className="card-profile__data">

      <div className="card-profile__description">
        {user.description}
      </div>
      <div className="card-profile__tags grid-one__column-mid-element">
        <TagsNav tags={user.tags} />
      </div>

    </div>
  )
}

function ProfileAdminOptions({ user }) {
  const updateRole = (userId, newRole) => {
    store.emit(
      new UpdateRole(
        userId,
        newRole,
        () => {
          alertService.info(t('common.done'));
          router.reload()
        },
        () => {
          alertService.error(t('common.error'));
        },
      ),
    );
  };

  const getOptions = (user) => {
    switch (user.role) {
      case Role.admin:
        return (
          <>
            <CardSubmenuOption
              onClick={() => {
                updateRole(user.id, Role.registered);
              }}
              label={t('moderation.revoke')}
            />
          </>
        );
      case Role.registered:
        return (
          <>
            <CardSubmenuOption
              onClick={() => {
                updateRole(user.id, Role.admin);
              }}
              label={t('moderation.promote')}
            />
            <CardSubmenuOption
              onClick={() => {
                updateRole(user.id, Role.blocked);
              }}
              label={t('moderation.block')}
            />
          </>
        );
      case Role.blocked:
        return (
          <CardSubmenuOption
            onClick={() => {
              updateRole(user.id, Role.registered);
            }}
            label={t('moderation.activate')}
          />
        );
    }
  };


  return <>{user && getOptions(user)}</>;
}


// Tabs.jsx
function TabItem(props) {
  return <div {...props} />;
}

function Tabs(props) {
  const [bindIndex, setBindIndex] = useState(props.defaultIndex);
  const changeTab = newIndex => {
    if (typeof props.onTabClick === "function") props.onTabClick(newIndex);
    setBindIndex(newIndex);
  };
  const items = props.children.filter(item => item.type.name === "TabItem");

  return (
    <div>
      <div className="card-profile__rating">

        {items.map(({ props: { index, label, onClick = () => { } } }) => (
          <button key={index} onClick={() => { changeTab(index); onClick() }} className={bindIndex === index ? "card-profile__rate card-profile__rate--enabled" : "card-profile__rate "}>
            <div className="card-profile__rate-label">
              {label}
            </div>
          </button>
        ))}
      </div>
      <div className="tab-view">
        {items.map(({ props }) => (
          <div
            {...props}
            className="tab-view_item"
            key={props.index}
            style={{ display: bindIndex === props.index ? "block" : "none" }}
          />
        ))}
      </div>
    </div>
  );
}
