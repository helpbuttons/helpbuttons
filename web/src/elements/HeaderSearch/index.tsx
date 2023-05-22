import { IoSearch } from "react-icons/io5";

///search button in explore and home
function HeaderSearch() {

  return (

         <div className="header-search__tool">

            <form className="header-search__form">

              <div className="header-search__column">
                <div className="header-search__label">48 botones · Albacete · 25km</div>
                <div className="header-search__info">Todos los tipos · Cualquier fecha</div>
                <div className="header-search__icon"><IoSearch/></div>
              </div>

            </form>

          </div>

  );
}

export { HeaderSearch };
