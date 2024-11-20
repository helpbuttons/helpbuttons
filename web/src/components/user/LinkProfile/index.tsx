import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import Link from "next/link";
import { store } from "pages";
import { FindAndSetMainPopupCurrentProfile, SetMainPopupCurrentProfile } from "state/HomeInfo";

export function LinkProfile({ username, avatar, name, extra = <></>}) {
    const onClick = (e) =>{
      e.preventDefault()
      store.emit(new FindAndSetMainPopupCurrentProfile(username))
    }
    return (
      <div className="form__list--button-type-field">
        <div className="card-button__header">
          <div className="card-button__avatar">
            <div className="avatar-big">
              <Link href="#" onClick={onClick}>
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
              <Link href="#" onClick={onClick}>
                {name}{' '}
                {/* <span className="card-button__username">
                  @{username}
                </span> */}
              </Link>
            </div>
            {extra}
          </div>
        </div>
      </div>
    );
  }