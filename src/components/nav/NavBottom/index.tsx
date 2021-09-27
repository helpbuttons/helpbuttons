//Mobile bottom navigation component with just creation , profile and home buttons if logged in. It not logged it shows home, Button creation , login and faqs too.
import CrossIcon from '../../../../public/assets/svg/icons/cross1.tsx'
import Link from 'next/link'

function NavBottom(){
  return(
      <nav id="bottom-nav" className="nav-bottom">

        <Link to="/" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Home
            </div>
        </Link>

        <Link to="/ButtonNew" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Create
            </div>
        </Link>

          <Link to="/Config" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Config
            </div>
        </Link>

          <Link to="/Profile" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Profile
            </div>
        </Link>

        <Link to="/ButtonFile" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Button
            </div>
        </Link>

        <Link to="/Login" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Login
            </div>
        </Link>

        <Link to="/Faqs" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Faqs
            </div>
        </Link>

      </nav>
  );
}

export default NavBottom
