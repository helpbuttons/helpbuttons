//Mobile bottom navigation component with just creation , profile and home buttons if logged in. It not logged it shows home, Button creation , login and faqs too.
import Link from 'next/link'
import CrossIcon from '../../../../public/assets/svg/icons/cross1'
import { useState, useEffect } from 'react';

import NavLink from 'elements/Navlink';
import { UserService } from 'services/Users';
import { HttpUtilsService } from 'services/HttpUtilsService';
import { BsFillHouseFill } from "react-icons/bs";

export default NavBottom;

function NavBottom({logged}){

  const [user, setUser] = useState(null);

  return(

      <nav id="bottom-nav" className="nav-bottom">

        <NavLink href="/" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
            <BsFillHouseFill/>
            </div>
            <div className="nav-bottom__text">
              Explore
            </div>
        </NavLink>

        <NavLink href="/ButtonNew" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Create
            </div>
        </NavLink>

        {!logged &&

          <NavLink href="/Faqs" className="nav-bottom__link nav-bottom__link--active">
              <div className="nav-bottom__icon">
                  <CrossIcon />
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
                      <CrossIcon />
                  </div>
                  <div className="nav-bottom__text">
                    Profile
                  </div>
              </NavLink>

              <NavLink href="/Notifications" className="nav-bottom__link nav-bottom__link--active">
                  <div className="nav-bottom__icon">
                      <CrossIcon />
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
                    <CrossIcon />
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
