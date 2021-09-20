//Mobile bottom navigation component with just creation , profile and home buttons if logged in. It not logged it shows home, Button creation , login and faqs too.
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'

function NavBottom(){
  return(
      <nav id="bottom-nav" class="nav-bottom">

        <a href="" class="nav-bottom__link nav-bottom__link--active">
            <div class="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div class="nav-bottom__text">
              Mapa
            </div>
        </a>

        <a href="" class="nav-bottom__link nav-bottom__link--active">
            <div class="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div class="nav-bottom__text">
              Mapa
            </div>
        </a>

        <a href="" class="nav-bottom__link nav-bottom__link--create">
            <div class="nav-bottom__icon">
                <CrossIcon />
            </div>
        </a>

        <a href="" class="nav-bottom__link nav-bottom__link--active">
            <div class="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div class="nav-bottom__text">
              Login
            </div>
        </a>

        <a href="" class="nav-bottom__link nav-bottom__link--active">
            <div class="nav-bottom__icon">
                <CrossIcon />
            </div>
            <div class="nav-bottom__text">
              Profile
            </div>
        </a>

      </nav>
  );
}

export default NavBottom
