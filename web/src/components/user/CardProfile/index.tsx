//Profile Card with the the info displayed by the user in Profile page. It shows different options depending if it's other user profile or your profile when logged.
import { IoPersonOutline } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";
import { IoRibbonOutline } from "react-icons/io5";
import { getHostname } from "shared/sys.helper";
import UserAvatar from '../components';


export default function CardProfile(props) {

  const user = props.user;

 
  return (
    <>
      <div className="card-profile__container">
        <div className="card-profile__container-avatar-content">

            <figure className="card-profile__avatar-container avatar">

              <div className="avatar-big">
                <UserAvatar user={user}/>

                {/* <ImageWrapper imageType={ImageType.avatar} src={user.avatar} alt="avatar"/> */}

              </div>

            </figure>

            <div className="card-profile__content">

              <div className="card-profile__avatar-container-name">
                { user.username }@{getHostname()}
              </div>

              {/* <figure className="card-profile__rating grid-three">

                <div className="paragraph grid-three__column">
                  90
                  <div className="btn-circle__icon">
                    <IoHeartOutline />
                  </div>
                </div>
                <div className="paragraph grid-three__column">
                  77
                  <div className="btn-circle__icon">
                    <IoPersonOutline />
                  </div>
                </div>
                <div className="paragraph grid-three__column">
                  23
                  <div className="btn-circle__icon">
                    <IoRibbonOutline />
                  </div>

                </div>

              </figure> */}

            </div>

        </div>

        {/* <div className="card-profile__data">

            <div className="card-profile__description grid-one__column-mid-element">
              Descripcion
            </div>

            <div className="card-profile__phone grid-one__column-mid-element">
              09099190109091
            </div>

            <div className="card-profile__tags grid-one__column-mid-element">
              <div className="hashtag hashtag--yellow">tag</div>
            </div>

        </div> */}

        

      </div>

    </>
  );
}
