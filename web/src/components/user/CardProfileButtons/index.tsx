import { ButtonLinkType } from "components/list/CardButtonList";
import ContentList, { ButtonsListEmpty } from "components/list/ContentList";
import { useButtonTypes } from "shared/buttonTypes";

export function CardProfileButtonList({buttons})
{
  const buttonTypes = useButtonTypes();

  if(!buttons ||
    buttons?.length < 1){
        return (<ButtonsListEmpty isLoadingButtons={false} buttons={buttons} filtered={false} isProfileList={true}/>)
    }
  
  return (
          <div className="card-profile__button-list">
            <ContentList
              buttons={buttons}
              buttonTypes={buttonTypes}
              linkType={ButtonLinkType.MAINPOPUP}
            />
          </div>
        )
}