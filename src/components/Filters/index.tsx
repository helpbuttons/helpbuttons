//Filters is the component under the search bar sectioon of the home page and other pages. It consist of several items all with button-fillter class, and its parts can be altered by the button templates of the selected network.
//if the filters are too many, it ddisplays a "more filters" option at the end that brings the PopupExtraFilters
export default function Filters() {
  return (
    <div class="filters">
      <div class="checkbox-filter__container">
        <div class="checkbox-filter__checkbox">

          <div class="checkbox-filter__content button-filter-with-icon">

            <div class="button-filter__icon red"></div>
            Necesitan

          </div>

        </div>

      </div>
      <div class="checkbox-filter__container">

        <div class="checkbox-filter__checkbox">

          <div class="checkbox-filter__content button-filter-with-icon">

            <div class="button-filter__icon red"></div>
            Ofrecen

          </div>

        </div>

      </div>
      <div class="button-filter">
            Order dropdown
      </div>
    </div>
  );
}
