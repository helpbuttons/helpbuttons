//Profile Card with the the info displayed by the user in Profile page. It shows different options depending if it's other user profile or your profile when logged.
import {  IoChatbubbleOutline, IoHandLeftOutline, IoHeartOutline, IoPersonOutline, IoRibbonOutline } from "react-icons/io5";
import { Link } from 'elements/Link';
import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'

import UserAvatar from '../components';
import { getHostname } from 'shared/sys.helper';
import t from 'i18n';
import { store } from "state";
import { UpdateRole, isAdmin } from "state/Users";
import { alertService } from "services/Alert";
import router from "next/router";
import { CardSubmenu, CardSubmenuOption } from "components/card/CardSubmenu";
import { Role } from "shared/types/roles";


export default function CardProfile({ user, showAdminOptions = false}) {

  return (
    <>

        <div className="card-profile__container-avatar-content">
              {showAdminOptions && 
              <ProfileAdminOptions user={user} />
            }
            <figure className="card-profile__avatar-container avatar">

              <div className="avatar-big">
                <UserAvatar user={user}/>

                {/* <ImageWrapper imageType={ImageType.avatar} src={user.avatar} alt="avatar"/> */}

              </div>

            </figure>

            <div className="card-profile__content">
            
              <div className="card-profile__avatar-container-name">

                <div className="card-profile__name">{user.name} {user?.role == Role.admin && <div className="hashtag hashtag--blue">Admin</div>}</div>
                <span className="card-profile__username">{ user.username }</span>
                
              </div>

              {/* {t('user.created_date')}: {readableTimeLeftToDate(user.created_at)} */}
    
              <figure className="card-profile__rating">

                <div className="paragraph grid-three__column">
                   {user.followsCount}
                  <div className="btn-circle__icon">
                    <IoHeartOutline />
                  </div>
                </div>
                <div className="paragraph grid-three__column">
                  {user.buttonCount}
                  <div className="btn-circle__icon">
                    <IoPersonOutline />
                  </div>
                </div>
                <div className="paragraph grid-three__column">
                  {user.commentCount}
                  <div className="btn-circle__icon">
                    <IoChatbubbleOutline />
                  </div>
                </div>

              </figure>

            </div>

        </div>

        <div className="card-profile__data">

            <div className="card-profile__tags grid-one__column-mid-element">
              {/* <div className="hashtag">{t('user.tags')}</div> */}
            </div>
            <div className="card-profile__description grid-one__column-mid-element">
               {user.description}
            </div>

            {/* <div className="card-profile__phone grid-one__column-mid-element">
              TODO: 
              - place

            </div> */}

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

  return <CardSubmenu>{user && getOptions(user)}</CardSubmenu>;
}