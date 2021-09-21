///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfoOverlay with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import HeaderInfoOverlay from "../HeaderInfoOverlay";
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'
import Filters from "../Filters";

function NavHeader(){
  return(

    <>

      <form className="nav-header__content">

          <button className="btn-circle">
            <div className="btn-circle__content">
              <div className="btn-circle__icon">
                <CrossIcon />
              </div>
            </div>
          </button>

          <div className="nav-header__content-message">
            <input className="form__input nav-header__content-input" placeholder="Search tags"></input>
          </div>

      </form>

      <Filters />

    </>

  );
}

export default NavHeader
