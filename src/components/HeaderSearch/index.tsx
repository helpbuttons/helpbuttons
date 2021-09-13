///fields for home search bar. It's an input bar that can change the number of input fileds dependin on the needs of the network (default is What? Where? When ?  but it can also have "To where"or hide/add fields depending on network needs)

export default function HeaderDesktop() {
  return (

    <div class="header-search">

      <div class="header-search__intro">

          <div class="header-search__logo">

            <div class="header-search__logo-net-title"><div class="header-search__logo-net-name"></div></div>

            <div class="header-search__logo-net-subt">
              basado en  logo
            </div>

          </div>

          <h1 class="header-search__title">
            La colaboración libre
          </h1>

      </div>

      <div class="header-search__content">
      </div>

      <div class="header-search__tool">

        <form class="header-search__form" onsubmit="return false;">

          <div class="header-search__column">

            <div class="header-search__label">Qué</div>
            <input type="text" class="header-search--tags" placeholder='Selecciona fecha'></input>

          </div>

          <div class="header-search__column">
              <div class="header-search__label">Dónde</div>
              <div class="header-search--location">Dónde</div>

          </div>

          <div class="header-search__column">

            <div class="header-search__label">Cuándo</div>
            <input type="text" class="header-search--time" placeholder='Selecciona fecha'></input>

          </div>

        </form>

      </div>

    </div>

  );
}
