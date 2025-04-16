//Profile Card with the the info displayed by the user in Profile page. It shows different options depending if it's other user profile or your profile when logged.
import {  IoAddCircleOutline, IoChatbubbleOutline, IoHandLeftOutline, IoHeartOutline, IoPersonOutline, IoRibbonOutline } from "react-icons/io5";
import { Link } from 'elements/Link';
import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'

import UserAvatar from '../components';
import { getHostname } from 'shared/sys.helper';
import t from 'i18n';
import { store, useGlobalStore } from "state";
import { UpdateRole, isAdmin } from "state/Users";
import { alertService } from "services/Alert";
import router from "next/router";
import { CardSubmenu, CardSubmenuOption } from "components/card/CardSubmenu";
import { Role } from "shared/types/roles";


export default function CardProfile({ user, showAdminOptions = false}) {

  const sessionUser = useGlobalStore((state) => state.sessionUser)
  
  return (
    <>
        <div className="card-profile__container-avatar-content">
              <CardSubmenu extraClass="card-profile__submenu" >
                {user?.role == Role.admin && 
                    <AdminOptions/>
                  }
                {showAdminOptions && 
                  <>
                    <ProfileAdminOptions user={user} />
                  </>
                }
                {user?.username == sessionUser?.username &&
                  <GeneralOptions />
                }
              </CardSubmenu>
            

            <figure className="card-profile__avatar-container avatar">

              <div className="avatar-big">

                <UserAvatar user={user}/>

              </div>


            </figure>

            <div className="card-profile__content">
            
              <div className="card-profile__avatar-container-name">

                <div className="card-profile__name">{user.name} {user?.role == Role.admin && <div className="card-profile__role hashtag hashtag--blue">Admin</div>} </div> 
                
                <div className="card-profile__username">{ user.username }</div>
                

              </div>

              {/* {t('user.created_date')}: {readableTimeLeftToDate(user.created_at)} */}
    
            </div>

        </div>
        <div className="card-profile__data">


          <div className="card-profile__description">
            {user.description}
          </div>
          <div className="card-profile__tags grid-one__column-mid-element">
           <div className="hashtag">{t('user.tags')}</div> 
          </div>

        </div>
        <figure className="card-profile__rating">

              <div className="card-profile__rate card-profile__rate--enabled">
                <div className="card-profile__rate-label">
                {t('user.timesFollowed')} 
                </div>
                {user?.followsCount ?? 0}
              </div>
              <div className="card-profile__rate">
                <div className="card-profile__rate-label">
                {t('user.helpbuttonsPublishedAmount')} 
                </div>
                {user?.buttonCount?? 0}
              </div>
              <div className="card-profile__rate">
                <div className="card-profile__rate-label">
                  {t('user.commentsAmount')} 
                </div>
                  {user?.commentCount ?? 0}
              </div>

          </figure>
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
              label={t('moderation.deactivate')}
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


function AdminOptions() {
  return (
    <>
          <CardSubmenuOption
            onClick={() => {
              router.push('/Configuration');
            }}
            label={t('configuration.title')}
          />
          <CardSubmenuOption
            onClick={() => {
              router.push('/Configuration/Moderation');
            }}
            label={t('configuration.moderation')}
          />
    </>
  );
}

function GeneralOptions() {
  return (
    <>
          <CardSubmenuOption
            onClick={() => {
              router.push('/ProfileEdit');
            }}
            label={t('user.editProfile')}
          />
          <CardSubmenuOption
            onClick={() => router.push('/Logout')}
            label={t('user.logout')}
          />
          
    </>
  );
}