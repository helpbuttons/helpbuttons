///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfoOverlay with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import HeaderInfoOverlay from "../HeaderInfoOverlay";
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'

function NavHeader(){
  return(

    <>

      <form class="nav-header__content" onsubmit="">

          <button class="btn-circle">
            <div class="btn-circle__content">
              <div class="btn-circle__icon">
                <CrossIcon />
              </div>
            </div>
          </button>

          <div class="nav-header__content-message">
            <input class="form__input nav-header__content-input" placeholder="Search tags"></input>
          </div>

          <button class="btn-circle">
            <div class="btn-circle__content">
              <div class="btn-circle__icon">
                <CrossIcon />
              </div>
            </div>
          </button>

      </form>

    </>

  );
}

export default NavHeader
