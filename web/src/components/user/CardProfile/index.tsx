//Profile Card with the the info displayed by the user in Profile page. It shows different options depending if it's other user profile or your profile when logged.
import {  IoAddCircleOutline, IoChatbubbleOutline, IoHandLeftOutline, IoHeartOutline, IoPersonOutline, IoRibbonOutline } from "react-icons/io5";
import { Link } from 'elements/Link';
import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'

import UserAvatar from '../components';
import { getHostname } from 'shared/sys.helper';
import t from 'i18n';
import { store, useGlobalStore } from "state";
import { FindUserButtons, UpdateRole, isAdmin } from "state/Users";
import { alertService } from "services/Alert";
import router from "next/router";
import { CardSubmenu, CardSubmenuOption } from "components/card/CardSubmenu";
import { Role } from "shared/types/roles";
import ContentList from "components/list/ContentList";
import { useEffect, useState } from "react";
import dconsole from "shared/debugger";
import { ButtonLinkType } from "components/list/CardButtonList";
import { useButtonTypes } from "shared/buttonTypes";
import { ShowProfile } from "pages/p/[username]";
import { set } from "immer/dist/internal";

export enum displayListTypes {
  INFO = 'info',
  PUBLISHED = 'published',
  FOLLOWED = 'followed',
  COMMENTED = 'commented'
}

export default function CardProfile({ user, showAdminOptions = false, displayListType = null, setDisplayListType = null }) {

  const sessionUser = useGlobalStore((state) => state.sessionUser)
  const [userButtons, setUserButtons] = useState(null);
  const buttonTypes = useButtonTypes();


  useEffect(() => {

    if (user && !userButtons) {
          store.emit(
            new FindUserButtons(user?.id, (userButtons) =>
              setUserButtons(userButtons),
            ),
          );
      }
    }, []);
  
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

                <UserAvatar user={user}/>

              </div>


            </figure>

            <div className="card-profile__content">
            
              <div className="card-profile__avatar-container-name">

                <div className="card-profile__name">{user.name} {user?.role == Role.admin && <div className="card-profile__role hashtag hashtag--blue">Admin</div>} </div> 
                
                <div className="card-profile__username">@{ user.username }</div>
                

              </div>

              {/* {t('user.created_date')}: {readableTimeLeftToDate(user.created_at)} */}
    
            </div>

        </div>
        <figure className={user?.showButtons ? "card-profile__rating" : "card-profile__rating disabled"} >
              <div onClick={() => setDisplayListType(displayListTypes.INFO)}  className={displayListType == displayListTypes.INFO ? "card-profile__rate card-profile__rate--enabled" : "card-profile__rate "}>
                <div className="card-profile__rate-label">
                {t('user.profileInfo')} 
                </div>
              </div>

              <div onClick={() => setDisplayListType(displayListTypes.PUBLISHED)} className={displayListType == displayListTypes.PUBLISHED ? "card-profile__rate card-profile__rate--enabled" : "card-profile__rate"}>
                <div className="card-profile__rate-label">
                {t('user.helpbuttonsPublishedAmount')} 
                </div>
                {user?.buttonCount ?? 0}
              </div>
              <div onClick={() => setDisplayListType(displayListTypes.FOLLOWED)} className={displayListType == displayListTypes.FOLLOWED ? "card-profile__rate card-profile__rate--enabled" : "card-profile__rate"}>
                <div className="card-profile__rate-label">
                {t('user.timesFollowed')} 
                </div>
                {user?.followsCount ?? 0}
              </div>
              <div onClick={() => setDisplayListType(displayListTypes.COMMENTED)} className={displayListType == displayListTypes.COMMENTED ? "card-profile__rate card-profile__rate--enabled" : "card-profile__rate "}>
                <div className="card-profile__rate-label">
                  {t('user.commentsAmount')} 
                </div>
                  {user?.commentCount ?? 0}
              </div>
      
                   
          </figure>

          { displayListType == displayListTypes.INFO &&
            <div className="card-profile__data">

              <div className="card-profile__description">
                {user.description}
              </div>
              <div className="card-profile__tags grid-one__column-mid-element">
              <div className="hashtag">{t('user.tags')}</div> 
              </div>

            </div>
          }

          {displayListType != displayListTypes.INFO &&
          
            <div className="card-profile__button-list">
              <ContentList
                buttons={userButtons}
                buttonTypes={buttonTypes}
              />
            </div>
          
          }


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
