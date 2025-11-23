import { ButtonLinkType } from "components/list/CardButtonList";
import ContentList, { ButtonsListEmpty } from "components/list/ContentList";
import t from "i18n";
import { useButtonTypes } from "shared/buttonTypes";
import { Role } from "shared/types/roles";
import { useGlobalStore } from "state";

export function CardProfileButtonList({user, buttons})
{
  const buttonTypes = useButtonTypes();
  const sessionUser = useGlobalStore((state) => state.sessionUser)

  if(!buttons ||
    buttons?.length < 1){
        return (<ButtonsListEmpty isLoadingButtons={false} buttons={buttons} filtered={false} isProfileList={true}/>)
    }
  
  return (<div className="card-profile__button-list-wrapper">
    
        <div className="card-profile__button-list-content">
          <div className="card-profile__rating">
                  <div className={'card-profile__rate ' + (sessionUser.id == user.id || sessionUser?.role == Role.admin ? ' card-profile__rate--published' : 'card-profile__rate--')}>
                    <div className="card-profile__rate-label">
                      {t('user.helpbuttonsPublishedAmount')}
                    </div>
                    {user?.buttonCount ?? 0}
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
          <div className="card-profile__button-list">
          
            <ContentList
              buttons={buttons}
              buttonTypes={buttonTypes}
              linkType={ButtonLinkType.MAINPOPUP}
            />
            
          </div>
        </div>

      </div>

    )
}