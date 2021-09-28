//Mobile bottom navigation component with just creation , profile and home buttons if logged in. It not logged it shows home, Button creation , login and faqs too.
import CrossIcon from '../../../../public/assets/svg/icons/cross1.tsx'
import Link from 'next/link'
import { useState, useEffect } from 'react';
import { NavLink } from '.';
import { userService } from 'services/Users';

export default NavBottom;

function NavBottom(){

  const [user, setUser] = useState(null);

  useEffect(() => {
      const subscription = userService.user.subscribe(x => setUser(x));
      return () => subscription.unsubscribe();
  }, []);

  function logout() {
      userService.logout();
  }

  // only show nav when logged in
  if (!user) return null;

  return(
      <nav id="bottom-nav" className="nav-bottom">

        <NavLink href="/" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Home
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

        <NavLink href="/Config" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Config
            </div>
        </NavLink>

        <NavLink href="/Profile" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Profile
            </div>
        </NavLink>

        <NavLink href="/ButtonFile" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Button
            </div>
        </NavLink>

        <NavLink href="/Login" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Login
            </div>
        </NavLink>

        <NavLink href="/Faqs" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Faqs
            </div>
        </NavLink>

        <a onClick={logout} className="nav-item nav-link">Logout</a>

      </nav>
  );
}
