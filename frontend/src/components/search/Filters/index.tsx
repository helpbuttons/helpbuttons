//Filters is the component under the search bar sectioon of the home page and other pages. It consist of several items all with btn-fillter class, and its parts can be altered by the btn templates of the selected network.

//if the filters are too many, it ddisplays a "more filters" option at the end that brings the PopupExtraFilters

export default function Filters({updateFiltersType}) {
  
  const buttonTypeChanged = (e) => {
    const buttonTypeName = e.target.value;
    const value = e.target.checked;
    updateFiltersType(buttonTypeName, value);
  }

  return (
    <div className="filters">

        <div className="checkbox-filter__container">
          <label className="checkbox__filter-label">
            <input type="checkbox" className="checkbox-filter__checkbox" id="input-tos" defaultChecked={true} value="need" onChange={buttonTypeChanged}></input>
            <div className="checkbox-filter__content btn-filter-with-icon">
              <div className="btn-filter__icon red"></div>
              <div className="checkbox__text">
                Need
              </div>
            </div>
          </label>
          <label className="checkbox__filter-label">
            <input type="checkbox" className="checkbox-filter__checkbox" id="input-tos" defaultChecked={true} value="offer" onChange={buttonTypeChanged}></input>
            <div className="checkbox-filter__content btn-filter-with-icon">
              <div className="btn-filter__icon green"></div>
              <div className="checkbox__text">
                Offer
              </div>
            </div>
          </label>
          <label className="checkbox__filter-label">
            <input type="checkbox" className="checkbox-filter__checkbox" id="input-tos" defaultChecked={true} value="exchange" onChange={buttonTypeChanged}></input>
            <div className="checkbox-filter__content btn-filter-with-icon">
              <div className="btn-filter__icon black"></div>
              <div className="checkbox__text">
                Exchange
              </div>
            </div>
          </label>
        </div>

{/* 
        <select className="dropdown__filter">
          <option value="status" className="dropdown-select__option">Status changes</option>
          <option value="status" className="dropdown-select__option">All comments</option>
          <option value="status" className="dropdown-select__option">Other users comments</option>
          <option value="status" className="dropdown-select__option">Telegram messages</option>
          <option value="status" className="dropdown-select__option">All interactions</option>
          <option value="status" className="dropdown-select__option">Other buttons interactions</option>
          <option value="status" className="dropdown-select__option">My buttons interactions</option>
        </select> */}

    </div>
  );
}
