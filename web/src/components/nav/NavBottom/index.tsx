//Mobile bottom navigation component with just creation , profile and home buttons if logged in. It not logged it shows home, Button creation , login and faqs too.
import { useEffect, useState } from 'react';

import NavLink from 'elements/Navlink';
import { IoAddOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";
import { IoLogInOutline } from "react-icons/io5";
import { IoHelpOutline } from "react-icons/io5";
import { IoGlobeOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";

import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useRef } from 'store/Store';

export default NavBottom;

function NavBottom(){
  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  
  return(

    <nav id="bottom-nav" className="nav-bottom">

        <NavLink href="/HomeInfo" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
            <IoHomeOutline/>
            </div>
            <div className="nav-bottom__text">
              {t("menu.home")}
            </div>
        </NavLink>

        <NavLink href="/Explore" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
            <IoGlobeOutline/>
            </div>
            <div className="nav-bottom__text">
              {t("menu.explore")}
            </div>
        </NavLink>

        <NavLink href="/ButtonNew" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <IoAddOutline/>
            </div>
            <div className="nav-bottom__text">
              {t("menu.create")}
            </div>
        </NavLink>

        {!loggedInUser &&

          <NavLink href="/Faqs" className="nav-bottom__link nav-bottom__link--active">
              <div className="nav-bottom__icon">
                  <IoHelpOutline />
              </div>
              <div className="nav-bottom__text">
                {t("menu.faqs")}
              </div>
          </NavLink>

        }

        {loggedInUser && (
            <>

              <NavLink href="/Profile" className="nav-bottom__link nav-bottom__link--active">
                  <div className="nav-bottom__icon">
                      <IoPersonOutline />
                  </div>
                  <div className="nav-bottom__text">
                    {t("menu.profile")}
                  </div>
              </NavLink>

              <NavLink href="/Activity" className="nav-bottom__link nav-bottom__link--active">
                  <div className="nav-bottom__icon">
                      <IoHeartOutline />
                  </div>
                  <div className="nav-bottom__text">
                    {t("menu.activity")}
                  </div>
              </NavLink>
            </>

        )}

        { !loggedInUser && (

            <NavLink href="/Login" className="nav-bottom__link nav-bottom__link--active">
                <div className="nav-bottom__icon">
                    <IoLogInOutline />
                </div>
                <div className="nav-bottom__text">
                  {t("menu.login")}
                </div>
            </NavLink>

          )
        }

      </nav>
  );
}
