//Mobile bottom navigation component with just creation , profile and home buttons if logged in. It not logged it shows home, Button creation , login and faqs too.
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'

function NavBottom(){
  return(
      <nav id="bottom-nav" class="nav-bottom">

        <a href="" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Home
            </div>
        </a>

        <a href="" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Create
            </div>
        </a>

        <a href="" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Login
            </div>
        </a>

        <a href="" className="nav-bottom__link nav-bottom__link--active">
            <div className="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div className="nav-bottom__text">
              Faqs
            </div>
        </a>

      </nav>
  );
}

export default NavBottom
