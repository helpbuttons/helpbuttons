import { IoSearch } from "react-icons/io5";
import React, {useState} from "react";

///search button in explore and home
function HeaderSearch({setShowFilters, showFilters}) {


  return (

         <div className="header-search__tool">

            <div className="header-search__form">

              <div className="header-search__column" onClick={(e) => {setShowFilters(!showFilters);}}>
                <div className="header-search__label">48 botones · Albacete · 25km</div>
                <div className="header-search__info">Todos los tipos · Cualquier fecha</div>
                <div className="header-search__icon"><IoSearch/></div>
              </div>

            </div>

          </div>

  );
}

export { HeaderSearch };
