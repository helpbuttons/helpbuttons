//Profile Card with the the info displayed by the user in Profile page. It shows different options depending if it's other user profile or your profile when logged.
import UserAvatar from '../components';
import t from 'i18n';
import { store, useGlobalStore } from "state";
import { UpdateRole, UserEndorse, UserRevokeEndorse, isAdmin } from "state/Users";
import { alertService } from "services/Alert";
import router from "next/router";
import { CardSubmenu, CardSubmenuOption } from "components/card/CardSubmenu";
import { Role } from "shared/types/roles";
import Link from 'next/link';
import Btn, { BtnType, IconType } from 'elements/Btn';
import { IoFolderOutline, IoHammerOutline, IoLogOutOutline } from 'react-icons/io5';
import { AdminOptions } from 'pages/Profile';


export default function CardProfile({ user, showAdminOptions = false, showProfileEdit = false}) {

    const sessionUser = useGlobalStore((state) => state.sessionUser)
  
  return (
    <>

        <div className="card-profile__container-avatar-content">

              {showAdminOptions && 

                <ProfileAdminOptions user={user} />

              }

            <figure className="card-profile__avatar-container avatar">

              <div className="avatar-big">

                <UserAvatar user={user}/>

              </div>

            </figure>

            <div className="card-profile__content">
            
              <div className="card-profile__avatar-container-name">

                <div className="card-profile__name">{user.name} </div> 
                <span className="card-profile__username">{ user.username }</span>
                
              </div>

              {/* {t('user.created_date')}: {readableTimeLeftToDate(user.created_at)} */}
    
            </div>

        </div>
        <div className="card-profile__role">{user?.role == Role.admin && <div className="hashtag hashtag--blue"> {t('roles.administrator')}</div>}{user?.endorsed && <div className="hashtag hashtag--badge">{t('user.endorsed')}</div>}</div>
        <div className="card-profile__data">

            {/* TODO: 
              - define what to do with tags
              <div className="card-profile__tags grid-one__column-mid-element"> */}
              {/* <div className="hashtag">{t('user.tags')}</div> */}
            {/* </div> */}
            <div className="card-profile__description">
               {user.description}
            </div>

        </div>
        
                {showProfileEdit && (
                  <>{(sessionUser.id == user.id && sessionUser?.role == Role.admin) && 
                    <span style={{"color": "red"}}>{t('user.addSupport')}</span>
                   }
                  <div className="card-profile__actions">
                    <Link href="/ProfileEdit">
                      <Btn
                        btnType={BtnType.filter}
                        iconLeft={IconType.svg}
                        iconLink={<IoHammerOutline />}
                        caption={t('user.editProfile')}
                      />
                    </Link>
                    {sessionUser?.role == Role.admin && 
                      <AdminOptions/>
                    }
                    <Link href="/">
                        <Btn
                          btnType={BtnType.filter}
                          iconLeft={IconType.svg}
                          iconLink={<IoLogOutOutline />}
                          caption={t('user.logout')}
                          onClick={() => router.push('/Logout')}
                        />
                    </Link>
                  </div>
                  </>
                )}
        <div className="card-profile__rating">

                <div className="card-profile__rate card-profile__rate--published">
                  <div className="card-profile__rate-label">
                  {t('user.helpbuttonsPublishedAmount')} 
                  </div>
                  {user?.buttonCount?? 0}
                </div>
                <div className="card-profile__rate">
                  <div className="card-profile__rate-label">
                  {t('user.timesFollowed')} 
                  </div>
                  {user?.followsCount ?? 0}
                </div>
                <div className="card-profile__rate">
                  <div className="card-profile__rate-label">
                    {t('user.commentsAmount')} 
                  </div>
                    {user?.commentCount ?? 0}
                </div>

            </div>
    </>
  );
}

function ProfileAdminOptions({ user }) {
  const updateRole = (userId, newRole) => {
    store.emit(
      new UpdateRole(
        userId,
        newRole,
        () => {
          alertService.info(t('common.done'));
          // router.reload()
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
            {getOptionEndorse(user)}
          </>)
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
            {getOptionEndorse(user)}
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
  const getOptionEndorse = (user) => {

    return <>
      {user.endorsed &&
        <CardSubmenuOption
          onClick={() => {
            store.emit(new UserRevokeEndorse(user.id));
          }}
          label={t('user.revokeEndorse')}
        />
      }
      {!user.endorsed &&
        <CardSubmenuOption
          onClick={() => {
            store.emit(new UserEndorse(user.id));
          }}
          label={t('user.endorse')}
        />
      }</>
  }
  return <CardSubmenu extraClass="card-profile__submenu" >{user && getOptions(user)}</CardSubmenu>;
}
