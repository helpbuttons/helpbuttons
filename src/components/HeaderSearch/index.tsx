///fields for home search bar. It's an input bar that can change the number of input fileds dependin on the needs of the network (default is What? Where? When ?  but it can also have "To where"or hide/add fields depending on network needs)
import Image from 'next/image'
import logo from '../../../public/assets/svg/logo/logo3-01.svg'
import Filters from "../Filters";


export default function HeaderDesktop() {
  return (
    <>

      <div className="header-search">

        <div className="header-search__title">

          <a href="#!"><img src="" alt=""/><Image src={logo} alt="icon"/></a>
          <span>Nombre de Red</span>
          <span>Descripción de Red</span>

        </div>

        <div className="header-search__intro">

            <div className="header-search__logo">

              <div className="header-search__logo-net-title"><div className="header-search__logo-net-name"></div></div>

              <div className="header-search__logo-net-subt">
                basado en  logo
              </div>

            </div>

            <h1 className="header-search__title">
              La colaboración libre
            </h1>

        </div>

        <div className="header-search__content">
        </div>

        <div className="header-search__tool">

          <form className="header-search__form" >

            <div className="header-search__column">

              <div className="header-search__label">Qué</div>
              <input type="text" className="header-search--tags" placeholder='Selecciona fecha'></input>

            </div>

            <div className="header-search__column">

                <div className="header-search__label">Dónde</div>
                <div className="header-search--location">Dónde</div>

            </div>

            <div className="header-search__column">

              <div className="header-search__label">Cuándo</div>
              <input type="text" className="header-search--time" placeholder='Selecciona fecha'></input>

            </div>

          </form>

        </div>

      </div>

      <Filters />

    </>
  );
}
