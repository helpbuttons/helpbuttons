//Mobile bottom navigation component with just creation , profile and home buttons if logged in. It not logged it shows home, Button creation , login and faqs too.
import { useEffect, useState } from 'react';

import NavLink from 'elements/Navlink';
import { IoAddOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";
import { IoLogInOutline } from "react-icons/io5";
import { IoHelpOutline } from "react-icons/io5";
import { IoGlobeOutline } from "react-icons/io5";
import { useRef } from "store/Store";
import { GlobalState, store } from 'pages';
import {ImageContainer} from "elements/ImageWrapper";

export default NavBottom;

function NavBottom({logged}){

  const [user, setUser] = useState(null);
  
  return(

    <nav id="bottom-nav" className="nav-bottom">
        <NavLink href="/Explore" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
            <IoGlobeOutline/>
            </div>
            <div className="nav-bottom__text">
              Explore
            </div>
        </NavLink>

        <NavLink href="/ButtonNew" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <IoAddOutline/>
            </div>
            <div className="nav-bottom__text">
              Create
            </div>
        </NavLink>

        {!logged &&

          <NavLink href="/Faqs" className="nav-bottom__link nav-bottom__link--active">
              <div className="nav-bottom__icon">
                  <IoHelpOutline />
              </div>
              <div className="nav-bottom__text">
                Faqs
              </div>
          </NavLink>

        }

        {logged && (
            <>

              <NavLink href="/Profile" className="nav-bottom__link nav-bottom__link--active">
                  <div className="nav-bottom__icon">
                      <IoPersonOutline />
                  </div>
                  <div className="nav-bottom__text">
                    Profile
                  </div>
              </NavLink>

              <NavLink href="/Notifications" className="nav-bottom__link nav-bottom__link--active">
                  <div className="nav-bottom__icon">
                      <IoHeartOutline />
                  </div>
                  <div className="nav-bottom__text">
                    Activity
                  </div>
              </NavLink>
            </>

        )}

        { !logged && (

            <NavLink href="/Login" className="nav-bottom__link nav-bottom__link--active">
                <div className="nav-bottom__icon">
                    <IoLogInOutline />
                </div>
                <div className="nav-bottom__text">
                  Login
                </div>
            </NavLink>

          )
        }

      </nav>
  );
}
