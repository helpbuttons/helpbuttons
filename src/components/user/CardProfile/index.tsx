//Profile Card with the the info displayed by the user in Profile page. It shows different options depending if it's other user profile or your profile when logged.
import ImageWrapper, { ImageType } from 'elements/ImageWrapper'
import CrossIcon from '../../../../public/assets/svg/icons/cross1'
import { Link } from 'elements/Link';
import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'

import { UserService } from 'services/Users';

export default function CardProfile() {


  function logout() {
      UserService.logout();
  }

  return (
    <>
      <div className="card-profile__container">
        <div className="card-profile__container-avatar-content">

            <figure className="card-profile__avatar-container avatar">

              <div className="avatar-big">

                <ImageWrapper imageType={ImageType.avatar} src="https://dummyimage.com/80/#ccc/fff" alt="avatar"/>

              </div>

            </figure>

            <div className="card-profile__content">

              <div className="card-profile__avatar-container-name">
                Username
              </div>

              <figure className="card-profile__rating grid-three">

                <div className="paragraph grid-three__column">
                  90
                  <div className="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </div>
                <div className="paragraph grid-three__column">
                  77
                  <div className="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </div>
                <div className="paragraph grid-three__column">
                  23
                  <div className="btn-circle__icon">
                    <CrossIcon />
                  </div>

                </div>

              </figure>

            </div>

        </div>

        <div className="card-profile__data">
          <div className="card-profile__description grid-one__column-mid-element">
            Descripcion
          </div>

              <div className="card-profile__phone grid-one__column-mid-element">
                09099190109091
              </div>
          <div className="card-profile__tags grid-one__column-mid-element">
            <div className="hashtag hashtag--yellow">tag</div>
          </div>
        </div>

        <Link href="/"><a onClick={logout} className="btn-with-icon">
          <div className="btn-with-icon__icon">
            <CrossIcon />
          </div>
          <span className="btn-with-icon__text">
            Logout
          </span>
        </a></Link>

        <Link href="/Config">
          <Btn contentAlignment={ContentAlignment.center} caption="Config account"  />
        </Link>

        <div className="btn-with-icon">
          <div className="btn-with-icon__icon">
            <CrossIcon />
          </div>
          <span className="btn-with-icon__text">
            Support User
          </span>
        </div>

      </div>
    </>
  );
}
